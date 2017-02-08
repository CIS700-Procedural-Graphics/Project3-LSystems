const THREE = require('three');
var Random = require("random-js");

import { LSystem, LContext, LRule, LInstruction, DummyInstruction } from './lsystem.js'

function toRadians(degrees)
{
	return degrees * Math.PI / 180.0;
}

function randomQuaternion(random, amplitude)
{
	var a = amplitude * .5;
	var euler = new THREE.Euler(a * random.real(-1,1, true), a * random.real(-1,1, true), a * random.real(-1,1, true));
	var quat = new THREE.Quaternion();
	quat.setFromEuler(euler);
	return quat;
}

class CrossSectionParameters
{
	constructor(a, b, m1, m2, n1, n2, n3)
	{
		this.a = a;
		this.b = b;
		this.m1 = m1;
		this.m2 = m2;
		this.n1 = n1;
		this.n2 = n2;
		this.n3 = n3;
	}

	evaluate(t)
	{
		var term1 = Math.pow(Math.abs(Math.cos(this.m1 * t * .25) / this.a), this.n2);
		var term2 = Math.pow(Math.abs(Math.sin(this.m2 * t * .25) / this.b), this.n3);
		return Math.pow(term1 + term2, -1.0 / this.n1);
	}
}

class PlantContext extends LContext
{
	constructor(position, rotation, branchLength, branchRadius, crossSection, random) 
	{
		super();

		this.position = position.clone();
		this.rotation = rotation.clone();
		this.branchLength = branchLength;
		this.branchRadius = branchRadius;
		this.random = random;
		this.crossSection = crossSection;
		this.renderable = false;
	}

	copy()
	{
		return new PlantContext(this.position, this.rotation, this.branchLength, this.branchRadius, this.crossSection, this.random);
	}
}

// A more specific instruction that can modify branches
class BranchInstruction extends LInstruction
{
	constructor()
	{
		super();
		// TODO: parametrization of branch modification
	}
	symbol() { return "B"; }

	evaluate(context, stack)
	{
		var c = context;
		c.branchLength *= .9;
		c.branchRadius *= .8;
		return c;
	}
}

class ForwardInstruction extends LInstruction 
{  
	symbol() { return "F"; }

	evaluate(context, stack) 
	{
		var c = context;
		c.position.add(new THREE.Vector3(0, context.branchLength, 0).applyQuaternion(c.rotation));
		c.renderable = true;
		return c;
	}
}

class DetailInstruction extends LInstruction 
{
	symbol() { return "Q"; }

	evaluate(context, stack) 
	{
		var c = context;

		var min = context.branchLength / 15;
		var max = context.branchLength / 3;
		var randomness = context.branchLength / 5;

		c.position.add(new THREE.Vector3(0, c.random.real(min, max, true), 0).applyQuaternion(c.rotation));
		c.renderable = true;
		c.rotation.multiply(randomQuaternion(c.random, toRadians(30)));
		c.branchRadius += c.random.real(-.1, .1, true) * c.branchRadius;
		return c;
	}
}

class RotatePositiveInstruction extends LInstruction
{
	symbol() { return "+"; }

	evaluate(context, stack) {
		var c = context;

		var euler = new THREE.Euler(0, 0, 1.25 * c.random.real(0,1, true));
		var quat = new THREE.Quaternion();
		quat.setFromEuler(euler);

		c.rotation.multiply(quat);
		return c;
	}
}

class RotateNegativeInstruction extends LInstruction
{
	symbol() { return "-"; }

	evaluate(context, stack) {
		var c = context;
		
		var euler = new THREE.Euler(0, 0, -1.25 * c.random.real(0,1, true));
		var quat = new THREE.Quaternion();
		quat.setFromEuler(euler);

		c.rotation.multiply(quat);
		return c;
	}
}

export default class PlantLSystem
{
	constructor()
	{
		var instructions = [new ForwardInstruction(), 
						new DummyInstruction("X"), 
						new DummyInstruction("Y"), 
						new RotateNegativeInstruction(), 
						new RotatePositiveInstruction(),
						new BranchInstruction(),
						new DetailInstruction()];

		var rules = [];
		// rules.push(new LRule("X", "FX", 1.0));
		rules.push(new LRule("X", "[B-FY][B+FY]FX", 1.0));
		rules.push(new LRule("Y", "[B-FY]", 1.0));

		// Detailing the branches
		rules.push(new LRule("F", "QQQQ", 1.0));
// 
		// rules.push(new LRule("X", "FX", 1.0));

		this.system = new LSystem("FX", instructions, rules, 8);


		// this.system = new LSystem("F[-F]QQQ", instructions, rules, 2);
	}

	expand()
	{
		return this.system.expand();
	}

	evaluate()
	{
		var random = new Random(Random.engines.mt19937().seed(13438));

		// (a, b, m1, m2, n1, n2, n3)
		var crossSection = new CrossSectionParameters(1,1,2,10,-1.5,1,1);
		var state = new PlantContext(new THREE.Vector3(0,0,0), new THREE.Quaternion().setFromEuler(new THREE.Euler(0,0,0)), 1.0, .2, crossSection, random);
		return this.system.evaluate(state);
	}

	generateCrossSectionVertices(geometry, state, subdivs)
	{
		var centerPoint = state.position;

		for(var s = 0; s < subdivs; s++)
		{
			var theta = s * 2 * 3.1415 / subdivs;
			var x = Math.cos(theta);
			var y = Math.sin(theta);

			var r = state.crossSection.evaluate(theta) * state.branchRadius;
			var point = centerPoint.clone().add(new THREE.Vector3(x * r, 0, y * r).applyQuaternion(state.rotation));

			geometry.vertices.push(point);
		}
	}

	generateMesh()
	{
		var geometry = new THREE.Geometry();

		var stateArray = this.evaluate();
		var prevPosition = stateArray[0].position;

		var material = new THREE.MeshLambertMaterial({ color: 0xffffff, emissive: 0x333333 });
		material.side = THREE.DoubleSide;
		// material.wireframe = true;
		var geometry = new THREE.Geometry();

		var stateArray = this.evaluate();

		var prevPosition = stateArray[0].position;
		var subdivs = 64;
		var segments = 0;

		var t = performance.now();

		// We always draw backwards, with consideration of branching and the first case
		for(var i = 0; i < stateArray.length; i++)
		{
			var p = stateArray[i].position;
			var offset = geometry.vertices.length - subdivs;

			// Note: if the grammar branched, we need to redraw the initial set of vertices
			if(i == 0 || stateArray[i].renderable || stateArray[i].branched)
				this.generateCrossSectionVertices(geometry, stateArray[i], subdivs);

			if((prevPosition.distanceTo(p) > .01 && stateArray[i].renderable))
			{
				// console.log(stateArray[i].position);
				// console.log(stateArray[i-1].position);
				// console.log('')

				if(offset >= 0)
				{
					for(var v = 0; v < subdivs; v++)
					{
						var v1 = offset + v;
						var v2 = offset + ((v + 1) % subdivs);
						var v3 = offset + subdivs + ((v + 1) % subdivs);

						var v4 = offset + v;
						var v5 = offset + subdivs + ((v + 1) % subdivs);
						var v6 = offset + subdivs + v;

						geometry.faces.push(new THREE.Face3(v3, v2, v1));
						geometry.faces.push(new THREE.Face3(v6, v5, v4));
					}

					segments++;
				}
			}

			prevPosition = p;
		}

		// console.log(stateArray);

		geometry.mergeVertices();
		geometry.computeVertexNormals();

		console.log("Mesh generation took " + t.toFixed(1) + "ms (" + segments + " segments, " + subdivs + " subdivs, " + geometry.vertices.length  + " vertices)");

		return new THREE.Mesh(geometry, material);
	}

	getLineDebugger()
	{
		var material = new THREE.LineBasicMaterial({ color: 0xffffff });
		material.transparent = true;
		material.depthTest = false;

		var geometry = new THREE.Geometry();

		var stateArray = this.evaluate();

		var prevPosition = stateArray[0].position;
		var subdivs = 8;

		for(var i = 0; i < stateArray.length; i++)
		{
			var p = stateArray[i].position;

			if(i == 0 || (prevPosition.distanceTo(p) > .01 && stateArray[i].renderable))
			{
				this.generateCrossSectionVertices(geometry, stateArray[i], subdivs);
				geometry.vertices.push(p);
			}


			prevPosition = p;
		}

		return new THREE.Line(geometry, material);
	}
}

// function EvaluatePlant() 
// {
// 	var instructions = [new ForwardInstruction(), 
// 						new DummyInstruction("X"), 
// 						new RotateNegativeInstruction(), 
// 						new RotatePositiveInstruction()];

// 	var rules = [];
// 	rules.push(new LRule("X", "[-FX][+FX]", 1.0));

// 	return new LSystem("FX", instructions, rules, 5);
// }
