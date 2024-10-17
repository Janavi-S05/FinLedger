import React from 'react'
import './cards.css';
import {Row, Card} from "antd";
import Button from '../Button/button';
function Cards({showExpenseModal,showIncomeModal,income,expense,balance}) {
  return (
    <div>
        <Row className='row'>
            <Card className='card' title='Balance'>
                <p>RS. {balance}</p>
                <Button text='Reset Balance'/>
            </Card>
            <Card className='card' title='Income'>
                <p>RS. {income}</p>
                <Button text='Add Income' onClick={showIncomeModal}/>
            </Card>
            <Card className='card' title='Expenses'>
                <p>RS. {expense}</p>
                <Button text='Add Expense' onClick={showExpenseModal}/>
            </Card>
        </Row> 
    </div>
  )
}

export default Cards;