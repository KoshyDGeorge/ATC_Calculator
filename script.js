let firstNumber;
let secondNumber;
let trigNumber;
let CurrentExpresstion;

let step = 0;
let operation;
let result = 0;
let firstNumArray =[];
let secondNumArray =[];
let trigNumArray =[];
let CurrentExpresstionArray =[];

const display = document.getElementById('display')
const output = document.getElementById('displayOutput')

function getNumber(Num){
    console.log(Num);
    CurrentExpresstionArray.push(Num);
    CurrentExpresstion = CurrentExpresstionArray.join('');
    display.value=CurrentExpresstion;

    // if( step === 0 || step ===1){
    //     firstNumArray.push(Num);
    //     step =1;
    //     firstNumber = Number(firstNumArray.join(''));
    //     display.value=firstNumber;
    // } 
    // else if(step===2){
    //     secondNumArray.push(Num);
    //     secondNumber = Number(secondNumArray.join(''));
    //     display.value = secondNumber;
    // }
    // else if(step===3){
    //     trigNumArray.push(Num);
    //     secondNumber = Number(secondNumArray.join(''));
    //     display.value = secondNumber;
    // }
}

function getOperator(operator){
    if(operator === "^"){
        CurrentExpresstionArray.push(operator);
        CurrentExpresstion = CurrentExpresstionArray.join('');
        display.value=CurrentExpresstion;
    }else{
        CurrentExpresstionArray.push(' ');
        CurrentExpresstionArray.push(operator);
        CurrentExpresstionArray.push(' ');
        CurrentExpresstion = CurrentExpresstionArray.join('');
        display.value=CurrentExpresstion;
    }
    
}

function clearScreen(){
    display.value = 0;
    output.value =0;
    firstNumArray = [];
    secondNumArray=[];
    firstNumber=null;
    secondNumber=null;
    step=0;
    operation=null;
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



function calculateExpression(){
    CurrentExpresstion = " "+CurrentExpresstion+" ";
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
        if(expression === 'broke'){
            return 'broke';
        }
        //by the time it leaves this, the expression should not have any parentheses
        const sinRegex = /\bSin\s*(-?\d+(\.\d+)?)\b/;
        while(sinRegex.test(expression)){
            const match = expression.match(sinRegex);
            const [fullMatch, num1] = match;
            const result = Math.sin((parseFloat(num1) * Math.PI) / 180);
            expression = expression.replace(fullMatch, result);
        }

        const cosRegex = /\bCos\s*(-?\d+(\.\d+)?)\b/;
        while(cosRegex.test(expression)){
            const match = expression.match(cosRegex);
            const [fullMatch, num1] = match;
            const result = Math.cos( (parseFloat(num1) * Math.PI) / 180);
            expression = expression.replace(fullMatch, result);
        }

        const tanRegex = /\bTan\s*(-?\d+(\.\d+)?)\b/;
        while(tanRegex.test(expression)){
            const match = expression.match(tanRegex);
            const [fullMatch, num1] = match;
            if((num1 * Math.PI) / 180 == 90){
                output.value = 'Tan calculation Error';
                return 'broke';
            }
            const result = Math.tan( (parseFloat(num1) * Math.PI) / 180);
            expression = expression.replace(fullMatch, result);
        }

        
        const exponentRegex = /(\d+(\.\d+)?)[\s]*[\^][\s]*(\d+(\.\d+)?)/;
        while(exponentRegex.test(expression)){
            const match = expression.match(exponentRegex);
            const [fullMatch, num1, _, num2] = match;
            const result =  parseFloat(num1)**parseFloat(num2);
            expression = expression.replace(fullMatch, result);
        }

        const multiplyDivideRegex = /(-?\s*\d+(\.\d+)?)[\s]*[\/\*][\s]*(-?\s*\d+(\.\d+)?)/;
        while(multiplyDivideRegex.test(expression)){
            const match = expression.match(multiplyDivideRegex);
            let [fullMatch, num1, _, num2] = match;
            num1=num1.replace(/ /g,'');
            num2=num2.replace(/ /g,'');
            const operator = fullMatch.includes("*") ? "*" : "/";
            if(operator === "/" && parseFloat(num2)===0){
                output.value = "Cannot Divide By Zero";
                return 'broke';
            }
            const result = operator ==='*' ? parseFloat(num1)*parseFloat(num2) : parseFloat(num1)/parseFloat(num2);
            expression = expression.replace(fullMatch, result);
        }

        const addSubtractRegex = /(\d+(\.\d+)?)\s*[-+]\s*(\d+(\.\d+)?)/;
        while(addSubtractRegex.test(expression)){
            const match = expression.match(addSubtractRegex);
            const [fullMatch,num1,_,num2] = match;
            const operator = fullMatch[match.index + num1.length].trim();
            const result = operator === '+' ? parseFloat(num1) + parseFloat(num2) : parseFloat(num1) - parseFloat(num2);
            expression = expression.replace(fullMatch,result);
        }
        return parseFloat(expression);
        
        
    }
    const result = evaluateExpression(CurrentExpresstion);
    
    CurrentExpresstion = null
    CurrentExpresstionArray =[];    
    if(result==='broke'){
        return 0;
    }
    output.value = result;
    
   


}