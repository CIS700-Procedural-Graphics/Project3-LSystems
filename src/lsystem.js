function Rule(prob, str) {
	this.probability = prob; // The probability that this Rule will be used when replacing a character in the grammar string
	this.successorString = str; // The string that will replace the char that maps to this Rule
}

export default function Lsystem(axiom, grammar, iterations) {
	// default LSystem
	this.axiom = "FX";
	this.grammar = {};
	this.grammar['X'] = [
		new Rule(1.0, '[-FX][+FX]')
	];
	this.iterations = 0; 
	
	// Setup axiom
	if (typeof axiom !== "undefined") {
		this.axiom = axiom;
	}

	// Setup grammar
	if (typeof grammar !== "undefined") {
		this.grammar = Object.assign({}, grammar);
	}
	
	// Setup iterations
	if (typeof iterations !== "undefined") {
		this.iterations = iterations;
	}

	// Update parameters
	this.UpdateAxiom = function(axiom) {
		// Setup axiom
		if (typeof axiom !== "undefined") {
			this.axiom = axiom;
		}
	}

	// Return results of lsystem after num iterations
	this.DoIterations = function(n) {
		var currString = this.axiom;

		// TODO: Replace this with function that applies grammar rules
		for(var i = 1; i <= n; i++) {
			currString += "F";
		}
		
		return currString;
	}
}