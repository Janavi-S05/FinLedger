import React, { useEffect } from 'react';
import { useState } from 'react';
import Header from '../components/Header/header';
import Cards from '../components/Cards/cards';
import AddIncomeModal from "../components/Modals/addIncome";
import AddExpenseModal from "../components/Modals/addExpense";
import { addDoc, collection, getDocs, query } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { toast } from 'react-toastify';
import Transaction from '../components/Transactions/transaction';
import NoTransaction from "../components/Transactions/noTransaction";
import { unparse } from 'papaparse';
import { Card, Row } from 'antd';
import Charts from "../components/Charts/charts";
export default function Dashboard() {
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);

  const [user] = useAuthState(auth);
  const [transactions,setTransactions]=useState([]);
  const [loading,setLoading]=useState(false);
  
  const [income,setIncome]=useState(0);
  const [expense,setExpense]=useState(0);
  const [balance,setBalance]=useState(0);
  
  const showExpenseModal = () => {
    setIsExpenseModalVisible(true);
  };

  const showIncomeModal = () => {
    setIsIncomeModalVisible(true);
  };

  const handleExpenseCancel = () => {
    setIsExpenseModalVisible(false);
  };

  const handleIncomeCancel = () => {
    setIsIncomeModalVisible(false);
  };

  const onFinish = (values, type) => {
    console.log("on finish ", values, type);
    const newTransaction={
      type: type,
      name:values.name,
      amount: parseFloat(values.amount),
      tag: values.tag,
      date: values.date.format("YYYY-MM-DD"),
    }
    addTransaction(newTransaction);
  }

  const addTransaction = async(transaction,many)=>{
    try{
      const docRef= await addDoc(
        collection(db,`users/${user.uid}/transactions`),
        transaction
      );
      console.log("Doc written with id: ",docRef.id);
      if(!many){ toast.success("Transaction added"); }
      let newTransaction=transactions;
      newTransaction.push(transaction);
      setTransactions(newTransaction);
      calculateBalance();
    }catch(e){
      console.error("Error adding doc: ",e);
      toast.error("Couldn't add transaction");
    }
  }

  useEffect(()=>{
    fetchTransactions();
  },[user]);

  const fetchTransactions = async()=>{
    setLoading(true);
    if(user)
    {
      const q=query(collection(db,`users/${user.uid}/transactions`));
      const querySnapshot = await getDocs(q);
      let transactionsArray=[];
      querySnapshot.forEach((doc) => {
        transactionsArray.push(doc.data());
      });
      setTransactions(transactionsArray);
      console.log("Transaction Array: ",transactionsArray);
      toast.success("Transactions Fetched!");
    }
    setLoading(false);
  }

  useEffect(()=>{
    calculateBalance();
  },[transactions]);
  const calculateBalance=()=>{
    let totalIncome=0;
    let totalExpense=0;
    transactions.forEach((transaction)=>{
      if(transaction.type==="income"){
        totalIncome+=transaction.amount;
      }
      else{
        totalExpense+=transaction.amount;
      }
    });
    setIncome(totalIncome);
    setExpense(totalExpense);
    setBalance(totalIncome-totalExpense);
  }

  function exportToCsv() {
    const csv = unparse(transactions, {
      fields: ["name", "type", "date", "amount", "tag"],
    });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "transactions.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  let sortedTransaction = transactions.sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
  });

  return (
    <div>
      <Header />
      
      <Cards
        income={income}
        expense={expense}
        balance={balance}
        showExpenseModal={showExpenseModal}
        showIncomeModal={showIncomeModal}
      />

      <AddExpenseModal
        isExpenseModalVisible={isExpenseModalVisible}
        handleExpenseCancel={handleExpenseCancel}
        onFinish={onFinish}
      />
      <AddIncomeModal
        isIncomeModalVisible={isIncomeModalVisible}
        handleIncomeCancel={handleIncomeCancel}
        onFinish={onFinish}
      />
      {transactions && transactions.length != 0 ? (
            <Charts sortedTransaction={sortedTransaction} />
          ) : (
            <NoTransaction/>
          )}

      <Transaction transactions={transactions} addTransaction={addTransaction} fetchTransactions={fetchTransactions} exportToCsv={exportToCsv}/>
    </div>
  )
}
