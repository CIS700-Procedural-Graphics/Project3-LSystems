import { LSystem, LRule, LInstruction, DummyInstruction } from './lsystem.js'

class ForwardInstruction extends LInstruction 
{  
	symbol() { return "F"; }

	evaluate(context, stack) {
		return context;
	}
}

class RotatePositiveInstruction extends LInstruction
{
	symbol() { return "+"; }

	evaluate(context, stack) {
		return context;
	}
}

class RotateNegativeInstruction extends LInstruction
{
	symbol() { return "-"; }

	evaluate(context, stack) {
		return context;
	}
}

export default function PlantLSystem() 
{
	var instructions = [new ForwardInstruction(), 
						new DummyInstruction("X"), 
						new RotateNegativeInstruction(), 
						new RotatePositiveInstruction()];

	var rules = [];
	rules.push(new LRule("X", "[-FX][+FX]", 1.0));
	
	return new LSystem("FX", instructions, rules, 5);
}

// export {PlantLSystem}