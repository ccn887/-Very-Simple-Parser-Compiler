function Calculator(inputString){

  this.tokenStream = this.lexer(inputString);
}

Calculator.prototype.lexer = function (inputString){
  var tokenTypes = [
    ["NUMBER",    /^\d+/ ],
    ["ADD",       /^\+/  ],
    ["SUB",       /^\-/  ],
    ["MUL",       /^\*/  ],
    ["DIV",       /^\//  ],
    ["LPAREN",    /^\(/  ],
    ["RPAREN",    /^\)/  ]
  ];

  var tokens = [];
  var matched = true;

  while(inputString.length > 0 && matched) {
    matched = false;


    tokenTypes.forEach(function(tokenRegex) {
      var token = tokenRegex[0];
      var regex = tokenRegex[1];

      var result = regex.exec(inputString);

      if(result !== null) {
        matched = true;
        tokens.push({name: token, value: result[0]});
        inputString = inputString.slice(result[0].length)
      }
    })

    if(!matched) {
      throw new Error("Found unparseable token: " + inputString);
    }

  }
  return tokens;
};


Calculator.prototype.peek = function(){
    return this.tokenStream[0] || null;
}

Calculator.prototype.get = function(){
  return this.tokenStream.shift()
}

function TreeNode(name,...children){
  this.name = name;
  this.children = children;
}

Calculator.prototype.parseExpression = function(){
  var term = this.parseTerm();
  var a = this.parseA();
  return new TreeNode("Expression", term, a);
}

Calculator.prototype.parseTerm = function(){
  var factor = this.parseFactor();
  var b = this.parseB();
  return new TreeNode("Term", factor, b);

  // if (peek.name === "NUMBER") {
  //   var xToken = this.get();
  //   var terminalNode = new TreeNode("Terminal", xToken);
  // }
// body
}

Calculator.prototype.parseFactor = function(){
  var peek = this.peek();
  if (peek && peek.name === "NUMBER"){
    return new TreeNode("F", this.get().value);
  }
  if (peek && peek.name === "LPAREN") {
    this.get();
    var expression = this.parseExpression();
    this.get();
    return new TreeNode("F", '(', expression, ')')
  } else {
    return new TreeNode("F");
  }
}

Calculator.prototype.parseA = function(){
  var peek = this.peek();
  if (peek && peek.name === "ADD") {
    this.get();
    return new TreeNode("A", '+', this.parseTerm(),this.parseA());

  } else if (peek && peek.name === "SUB") {
    this.get();
    return new TreeNode("A", '-', this.parseTerm(), this.parseA());

  } else {
    return new TreeNode("A");
  }
}

Calculator.prototype.parseB = function(){
  var peek = this.peek();

  if (peek && peek.name === "MUL") {
    this.get();
    return new TreeNode("B", '*', this.parseFactor(),this.parseB());

  } else if (peek && peek.name === "DIV") {
    this.get();
    return new TreeNode("B", '/', this.parseFactor(), this.parseB());

  } else {
    return new TreeNode("B");
  }
}

var calculator = new Calculator('(3)');

var fakeExpressionTreeNode = new TreeNode("Expression", "3");
calculator.parseExpression = function() {
  this.get(); // remove the 3 when parseFactor runs
  return fakeExpressionTreeNode;
}

TreeNode.prototype.accept = function(visitor){
  return visitor.visit(this)
}

function PrintOriginalVisitor(){};
PrintOriginalVisitor.prototype.visit = function(treeNode){
  var node = treeNode;
  switch(node.name){
    case "Expression":
      var term = node.children[0];
      var a = node.children[1];
      break;
    case "Term":
    var factorOut = node.children[0].accept(this);
    var bOut = node.children[1].accept(this);

      break;
    case "Expression":
      break;
  }
}



var output = calculator.parseFactor();
console.log(output);



// E => T A
// A => + T A
//      - T A
//      epsilon
// T => F B
// B => * F B
//      / F B
//      epsilon
// F => ( E )
//      - F
//      NUMBER
