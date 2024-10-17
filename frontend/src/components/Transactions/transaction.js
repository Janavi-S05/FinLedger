import React, { useState } from 'react'
import { Select, Table, Radio } from "antd";
import { Option } from 'antd/es/mentions';
import searchImg from "../../assets/search.svg";
import { toast } from 'react-toastify';
import {parse} from "papaparse";
function Transaction({ transactions, addTransaction, fetchTransactions,exportToCsv}) {
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [sortKey, setSortKey] = useState("");

    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name"
        },
        {
            title: "Amount",
            dataIndex: "amount",
            key: "amount"
        },
        {
            title: "Tag",
            dataIndex: "tag",
            key: "tag"
        },
        {
            title: "Type",
            dataIndex: "type",
            key: "type"
        },
        {
            title: "Date",
            dataIndex: "date",
            key: "date"
        }
    ];

    let filteredTransactions = transactions.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase()) &&
        item.type.includes(typeFilter)
    );

    let sortedTransaction = filteredTransactions.sort((a, b) => {
        if (sortKey === "date") {
            return new Date(a.date) - new Date(b.date);
        }
        else if (sortKey === "amount") {
            return a.amount - b.amount;
        }
        else return 0;
    });

    function importFromCsv(event) {
        event.preventDefault();
        try {
          parse(event.target.files[0], {
            header: true,
            complete: async function (results) {
              // Now results.data is an array of objects representing your CSV rows
              for (const transaction of results.data) {
                // Write each transaction to Firebase, you can use the addTransaction function here
                console.log("Transactions", transaction);
                const newTransaction = {
                  ...transaction,
                  amount: parseFloat(transaction.amount),
                };
                await addTransaction(newTransaction, true);
              }
            },
          });
          toast.success("All transaction added");
          fetchTransactions();
          event.target.files = null;
        } catch (e) {
          toast.error(e.message);
        }
      }
    
    return (
        <div style={{ padding: "0rem 2rem" }}>
            <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "1rem" }}>

                <div className='flex-input'>
                    <img src={searchImg} width="16" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name"
                    />
                </div>

                <Select
                    className='select-input'
                    onChange={(value) => setTypeFilter(value)}
                    value={typeFilter}
                    placeholder="Filter"
                    allowClear
                >
                    <Option value="">All</Option>
                    <Option value="income">Income</Option>
                    <Option value="expense">Expense</Option>
                </Select>

            </div>

            {/* <div>
                <Radio.Group
                    className="radio-input"
                    onChange={(e) => setSortKey(e.target.value)}
                    value={sortKey}
                >
                    <Radio.Button value="">No Sort</Radio.Button>
                    <Radio.Button value="date">Sort by Date</Radio.Button>
                    <Radio.Button value="amount">Sort by Amount</Radio.Button>
                </Radio.Group>
                <Table dataSource={sortedTransaction} columns={columns} />
            </div>
            </div> */}
            <div className="my-table">
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                        marginBottom: "1rem",
                    }}
                >
                    <h2>My Transactions</h2>

                    <Radio.Group
                        className="radio-input"
                        onChange={(e) => setSortKey(e.target.value)}
                        value={sortKey}
                    >
                        <Radio.Button value="" className='box'>No Sort</Radio.Button>
                        <Radio.Button value="date" className='box'>Sort by Date</Radio.Button>
                        <Radio.Button value="amount" className='box'>Sort by Amount</Radio.Button>
                    </Radio.Group>

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            gap: "1rem",
                            width: "400px",
                        }}
                    >
                        <button className="btn" onClick={exportToCsv}>
                            Export to CSV
                        </button>
                        <label for="file-csv" className="btn btn-blue">
                            Import from CSV
                        </label>
                        <input onChange={importFromCsv}
                            id="file-csv"
                            type="file"
                            accept=".csv"
                            required
                            style={{ display: "none" }}
                        />
                    </div>
                </div>

                <Table columns={columns} dataSource={sortedTransaction} />
            </div>
        </div >
    )
}
export default Transaction;