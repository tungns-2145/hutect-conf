import React, {Component} from 'react';
import { Grid,Modal } from '@material-ui/core';

import { AccountProfile, EnterPaymentCode } from './components';
import {UsersTable} from '../UserList/components';
import moment from 'moment';
import { db } from '../../config';
class Account extends Component {
  constructor(props){
    super(props);
    this.state ={
      log: [],
      confirmModal: {
        open: true,
        event: null
      },
      paymentInfo: {
        name: 'Name',
        city: 'Hà Nội',
        country: 'Việt Nam',
        timezone: 'GTM-7',
        avatar: '/images/avatars/default.jpg',
        balance: 0,
        payment_code: ''
      }
    }
  }

  componentDidMount(){
    // const uid = localStorage.getItem('uid')
    // const email = localStorage.getItem('email')
    // if (uid) {
    //   this.setState({ userName: email, uid })
    // }
    // this.getCalender()
  }

  getPaymentInfo = async (paymentCode) => {
    const paymentInfo = await db.collection('payment-info')
    .where('payment_code', '==', paymentCode)
    .get()
    return paymentInfo.docs.map(info => ({...info.data(), id: info.id}))
  }
  formatDatetime(target, format) {
    console.log(target, format)
    return moment(target).format(format)
  }

  getLog = async (paymentCode) => {
    const logIn = await db.collection('log_in_class')
    .where('payment_code', '==', paymentCode)
    .orderBy("time_in", "asc")
    .get()
    return logIn.docs.map(log => ({
      id: log.id,
      title: log.data().title,
      time_in: this.formatDatetime(log.data().time_in.toDate(), 'DD-MM-YYYY HH:mm:ss')
    }))
  }

  handleModalClose = () => {
    this.props.history.push('/')
  };

  handleGetPaymentInfo = async (event) => {
    const {paymentCode} = event
    const paymentInfo = await this.getPaymentInfo(paymentCode)
    if(paymentInfo.length > 0) {
      const {name, balance, payment_code} = paymentInfo[0]
      const logIn = await this.getLog(paymentCode)
      console.log(logIn)
      this.setState({
        log:logIn,
        paymentInfo: {
          ...this.state.paymentInfo,
          name,
          balance,
          payment_code
        },
        confirmModal: {
          open: false,
          event: null
        },
      })
    }
  }

  render(){
    return (
      <div style= {{padding: '32px'}}>
        {
          this.state.confirmModal.open ? 
          <Modal
            onClose={this.handleModalClose}
            open={this.state.confirmModal.open}
          >
            <EnterPaymentCode
              event = {this.state.paymentInfo}
              onCancel={this.handleModalClose}
              onSubmit={this.handleGetPaymentInfo}
            />
          </Modal>
          :
          <Grid
          container
          spacing={4}
        >
          <Grid
            item
            lg={4}
            md={6}
            xl={4}
            xs={12}
          >
            <AccountProfile 
              userInfo = {this.state.paymentInfo}
            />
          </Grid>
          <Grid
            item
            lg={8}
            md={6}
            xl={8}
            xs={12}
          >
            <UsersTable 
              users={this.state.log}
            />
          </Grid>
        </Grid>
        }
      </div>
    );
  }

}
export default Account;
