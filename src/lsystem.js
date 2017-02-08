// A class that represents a symbol replacement rule to
// be used when expanding an L-system grammar.
function Rule(prob, str) {
	this.prob = prob; // The prob that this Rule will be used when replacing a character in the grammar string
	this.symbol = str; // The string that will replace the char that maps to this Rule
};

function parse(g) {
  let grammar = {};
  let rules = g.split('\n');
  rules.map((rule) => {
    let [lvalue, rvalue] = rule.split('=>');
    let [rsym, prob] = lvalue.split(',');
    rsym = rsym.trim();
    prob = prob.trim();
    rvalue = rvalue.trim();
    if (!grammar[rsym]) {
      grammar[rsym] = [
        new Rule(parseFloat(prob), rvalue)
      ];
    } else {
      grammar[rsym].push(new Rule(parseFloat(prob), rvalue));
    }
  });
  return normalize(grammar);
}

function normalize(g) {
  for (let key in g) {
    let sum = 0;
    let rules = g[key];
    for (let i = 0; i < rules.length; i++) {
      sum += rules[i].prob;
    }
    for (let i = 0; i < rules.length; i++) {
      rules[i].prob /= sum;
    }
  }
  return g;
}

export default function Lsystem(axiom, grammar, iterations) {
  this.grammar = parse(grammar);
  this.axiom = axiom;
  this.iterations = iterations;


  this.updateAxiom = function(axiom) {
		if (typeof axiom !== "undefined") {
			this.axiom = axiom;
		}
	}

  this.updateGrammar = function(grammar) {
    if (typeof grammar !== "undefined") {
      this.grammar = parse(grammar);
    }
  }


	this.doIterations = function(n) {
		let axiom = this.axiom;
		for (let i = 0; i < n; i++) {
			let newAxiom = "";
			for (let c = 0; c < axiom.length; c++) {
				let char = axiom[c];
				let rules = this.grammar[char];
				if (rules) {
					let prob = 0;
					let r = Math.random();
					for (let j = 0; j < rules.length; j++) {
						prob += rules[j].prob;
						if (prob > r) {
              newAxiom += rules[j].symbol;
							break;
						}
					}
				} else {
					newAxiom += char;
				}
			}
			axiom = newAxiom;
		}
		return axiom;
	}
}
