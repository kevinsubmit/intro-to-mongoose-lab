const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');
const Customer = require('./models/customer.js');
const prompt = require('prompt-sync')();

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        await runQueries();
    } catch (error) {
        console.error('connect error', error);
        process.exit(1);
    }
}

const runQueries = async () => {
    while(true) {
        console.log('\nplease choose:');
        console.log('1. create customer');
        console.log('2. view all customers');
        console.log('3. update customer info');
        console.log('4. delete customer');
        console.log('5. quit');
        
        const operator = prompt('please input option(1-5): ');
        
        switch(operator) {
            case '1':
                await createCustomer();
                break;
            case '2':
                await viewCustomer();
                break;
            case '3':
                await updateCustomer();
                break;
            case '4':
                await deleteCustomer();
                break;
            case '5':
                quiting();
                return;
            default:
                console.log('invalid option, please input again');
        }
    }
}

const createCustomer = async () => {
    try {
        const username = prompt('please input customer name: ');
        const age = parseInt(prompt('please input customer age: '));

        if(!username || isNaN(age)) {
            throw new Error('invalid input');
        }

        const CustomerData = {
            name: username,
            age: age
        }
        const customer = await Customer.create(CustomerData);
        console.log('客户创建成功:', customer);
    } catch (error) {
        console.error('create customer error', error.message);
    }
}

const viewCustomer = async () => {
    try {
        const customers = await Customer.find({});
        if(customers.length === 0) {
            console.log('no customer data');
            return;
        }
        console.log('\ncustomer list:');
        customers.forEach(customer => {
            console.log(`ID: ${customer._id}, name: ${customer.name}, age: ${customer.age}`);
        });
    } catch (error) {
        console.error('get customer list error', error.message);
    }
}

const updateCustomer = async () => {
    try {
        await viewCustomer();
        const id = prompt('please input customer id to update: ');
        const username = prompt('please input new customer name: ');
        const age = parseInt(prompt('please input new customer age: '));

        if(!username || isNaN(age)) {
            throw new Error('invalid input');
        }

        const customer = await Customer.findByIdAndUpdate(
            id,
            { name: username, age: age },
            { new: true }
        );

        if(!customer) {
            throw new Error('no customer found');
        }
        console.log('customer info updated successfully:', customer);
    } catch (error) {
        console.error('update customer info error', error.message);
    }
}

const deleteCustomer = async () => {
    try {
        await viewCustomer();
        const id = prompt('please input customer id to delete: ');
        
        const customer = await Customer.findByIdAndDelete(id);
        if(!customer) {
            throw new Error('no customer found');
        }
        console.log('customer deleted successfully:', customer);
    } catch (error) {
        console.error('delete customer error', error.message);
    }
}

const welcome = () => console.log('welcome to customer relationship management system(CRM)');
const quiting = () => console.log('exiting.....');

welcome();
connect();
