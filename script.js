let CurrentExpresstion;
let result = 0;
let CurrentExpresstionArray =[];

const display = document.getElementById('display')
const output = document.getElementById('displayOutput')

function getNumber(Num){
    CurrentExpresstionArray.push(Num);
    CurrentExpresstion = CurrentExpresstionArray.join('');
    display.value=CurrentExpresstion;
}

function getOperator(operator){
    if((operator === '-' || operator === '+') && (CurrentExpresstionArray[CurrentExpresstionArray.length -1]=='e')){
        getNumber(operator);
        return;
    }
    CurrentExpresstionArray.push(' ');
    CurrentExpresstionArray.push(operator);
    CurrentExpresstionArray.push(' ');
    CurrentExpresstion = CurrentExpresstionArray.join('');
    display.value=CurrentExpresstion;
    
}

function clearScreen(){
    display.value = 0;
    output.value =0;
    result=0;
    CurrentExpresstion = null
    CurrentExpresstionArray =[];    

}

function getOperatorTrig(TrigFunction){
    CurrentExpresstionArray.push(TrigFunction);
    CurrentExpresstionArray.push('(');
    CurrentExpresstion = CurrentExpresstionArray.join('');
    display.value=CurrentExpresstion;
}

function backspace(){
    CurrentExpresstionArray.pop();
    CurrentExpresstion = CurrentExpresstionArray.join('');
    display.value = CurrentExpresstion;
}

function resolveTrigFunction(expression,trigFunction){
    let Regex;
    let mathTrigFunction ;
    if(trigFunction === 'Sin'){
        Regex = /\bSin\s*(-?\d+(\.\d+)?)\b/;
        mathTrigFunction = Math.sin;

    }else if(trigFunction === 'Tan'){
        Regex = /\bTan\s*(-?\d+(\.\d+)?)\b/;
        mathTrigFunction = Math.tan;
    }else{
        Regex = /\bCos\s*(-?\d+(\.\d+)?)\b/;
        mathTrigFunction = Math.cos;
    }

    
    while(Regex.test(expression)){
        const match = expression.match(Regex);
        const [fullMatch, num1] = match;
        const result = mathTrigFunction((parseFloat(num1) * Math.PI) / 180);
        expression = expression.replace(fullMatch, result);
    }
    return expression;

}

function evaluateParentheses(subExpression){

    while(subExpression.includes('(')){
        const openParenthesesIndex = subExpression.lastIndexOf('(');
        const closeParenthesesIndex = subExpression.indexOf(')',openParenthesesIndex);
        const innerExpression = subExpression.slice(openParenthesesIndex+1, closeParenthesesIndex);
        const innerResult = evaluateExpression(innerExpression);
        if(innerResult === 'broke'){
            return 'broke';
        }
        subExpression = subExpression.slice(0, openParenthesesIndex) + innerResult + subExpression.slice(closeParenthesesIndex+1);
        
    }
    return subExpression;
    
}

function evaluateExpression(expression){

    
    expression = evaluateParentheses(expression);

    expression = resolveTrigFunction(expression,'Sin');
    expression = resolveTrigFunction(expression,'Cos');
    expression = resolveTrigFunction(expression,'Tan');

    
    const exponentRegex = /(\d+(\.\d+)?([eE][+-]?\d+)?)[\s]*[\^][\s]*(\d+(\.\d+)?([eE][+-]?\d+)?)/    ;
    while(exponentRegex.test(expression)){
        const match = expression.match(exponentRegex);
        const [fullMatch, number1, _, _1, number2] = match;
        const result =  parseFloat(number1)**parseFloat(number2);
        expression = expression.replace(fullMatch, result);
    }

    



    const multiplyDivideRegex = /(-?\s*\d+(\.\d+)?([eE][+-]?\d+)?)[\s]*[\/\*][\s]*(-?\s*\d+(\.\d+)?([eE][+-]?\d+)?)/    ;
    while(multiplyDivideRegex.test(expression)){
        const match = expression.match(multiplyDivideRegex);
        let [fullMatch, number1, _,_1, number2] = match;
        number1=number1.replace(/ /g,'');
        number2=number2.replace(/ /g,'');
        const operator = fullMatch.includes("*") ? "*" : "/";
        if(operator === "/" && parseFloat(number2)===0){
            output.value = "Cannot Divide By Zero";
            return 'broke';
        }
        const result = operator ==='*' ? parseFloat(number1)*parseFloat(number2) : parseFloat(number1)/parseFloat(number2);
        expression = expression.replace(fullMatch, result);
    }

    const addSubtractRegex = /(\d+(\.\d+)?([eE][+-]?\d+)?)\s*[-+]\s*(\d+(\.\d+)?([eE][+-]?\d+)?)/    ;
    while(addSubtractRegex.test(expression)){
        const match = expression.match(addSubtractRegex);
        const [fullMatch,number1,_,_1,number2] = match;
        const operator = fullMatch[match.index + number1.length].trim();
        const result = operator === '+' ? parseFloat(number1) + parseFloat(number2) : parseFloat(number1) - parseFloat(number2);
        expression = expression.replace(fullMatch,result);
    }
    return parseFloat(expression);
    
    
}


function calculateExpression(){
    CurrentExpresstion = " "+CurrentExpresstion+" ";
    
    const result = evaluateExpression(CurrentExpresstion);
    
    CurrentExpresstion = null
    CurrentExpresstionArray =[];    
    if(result==='broke'){
        return 0;
    }
    output.value = result;
    
   


}