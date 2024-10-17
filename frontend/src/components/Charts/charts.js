import React from 'react'
import { Line, Pie } from '@ant-design/charts';
function charts({ sortedTransaction }) {

    const data = sortedTransaction.map((item) => {
        return { date: item.date, amount: item.amount };
    });

    const spendingData = sortedTransaction.filter((transaction) => {
        if (transaction.type === "expense") {
            return {
                tag: transaction.tag,
                amount: transaction.amount
            }
        }
    });

    // const spending= spendingData.reduce((acc,obj)=>{
    //     let key= obj.tag;
    //     if(!acc[key]){
    //         acc[key]={tag:obj.tag,amount:transaction.amount}
    //     }
    //     else{
    //         acc[key].amount+=obj.amount;
    //     }
    //     return acc;
    // },{});
    const spending = [
        { tag: "food", amount: 0 },
        { tag: "education", amount: 0 },
        { tag: "office", amount: 0 },
    ]

    spendingData.forEach((item) => {
        if (item.tag == "food") {
            spending[0].amount += item.amount;
        }
        else if (item.tag == "education") {
            spending[1].amount += item.amount;
        }
        else {
            spending[2].amount += item.amount;
        }
    });
    const savingData = sortedTransaction.filter((transaction) => {
        if (transaction.type === "income") {
            return {
                tag: transaction.tag,
                amount: transaction.amount
            }
        }
    });

    const saving = [
        { tag: "investment", amount: 0 },
        { tag: "salary", amount: 0 },
        { tag: "freelance", amount: 0 },
    ]

    savingData.forEach((item) => {
        if (item.tag == "investment") {
            saving[0].amount += item.amount;
        }
        else if (item.tag == "salary") {
            saving[1].amount += item.amount;
        }
        else {
            saving[2].amount += item.amount;
        }
    });

    const config = {
        width: 500,
        height: 500,
        data: data,
        autoFit: false,
        xField: 'date',
        yField: 'amount',
    };
    const spendingConfig = {
        width: 250,
        height: 250,
        data: spending,
        autoFit: false,
        angleField: 'amount',
        colorField: 'tag',
    };
    const incomeConfig = {
        width: 250,
        height: 250,
        data: saving,
        autoFit: false,
        angleField: 'amount',
        colorField: 'tag',
    };

    return (
        <div className='charts'>
            <div className='line-graph'>
                <h2>Analytics</h2>
                <Line {...config}/>
            </div>
            <div className='pie'>
                <h2>Spendings & Savings</h2>
                <Pie {...spendingConfig} />
                <Pie {...incomeConfig} />
            </div>
        </div>
    )
}

export default charts;