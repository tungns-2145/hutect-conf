import React, { Component } from 'react';
import { Grid, Modal } from '@material-ui/core';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import {AddEvent } from '../UserList/components';
import { ConfirmPayment } from './components';
import 'react-big-calendar/lib/css/react-big-calendar.css';
// import { Base64 } from 'js-base64';
// import sha1 from 'js-sha1';
import { db } from '../../config';

// const SECRET = '8cd8ef52e8e101574e400365b55e11a6';
const domain  = 'https://meet.jit.si';

const localizer = momentLocalizer(moment);

class ProductList extends Component {
  constructor(props){
    super(props);
    this.state ={
      pricingModalOpen: false,
      eventModal: {
        open: false,
        event: null
      },
      confirmModal: {
        open: false,
        linkClass: null
      },
      linkClass: '',
      userName: '',
      uid: '',
      title: '',
      start : 0,
      end: 0,
      events: [],
      publicFlag: true
    }
  }

  componentDidMount(){
    const uid = localStorage.getItem('uid')
    const email = localStorage.getItem('email')
    if (uid) {
      this.setState({ userName: email, uid })
    }
    this.getCalender()
  }

  async getCalender() {
    const calender = await db.collection(`link_class`).get()
    const promise = calender.docs.map(doc => ({
      linkClass: doc.data().linkClass,
      title: doc.data().title,
      start: doc.data().start.toDate(),
      end: doc.data().end.toDate(),
      id: doc.id
    }))
    const events = await Promise.all(promise)
    this.setState({events})
  }

  handlePricingOpen = async (event) => {
    if(this.state.uid !== ''){
      this.setState({
        linkClass: event.linkClass,
        eventModal: {
          open: true,
          event: event
        },
        title: event.title
      });
    }else {
      const now = new Date()
      if (now.getTime() >= new Date(event.start).getTime() && now.getTime() <= new Date(event.end).getTime()){
        this.setState({
          confirmModal: {
            open: true,
            event: {
              linkClass :event.linkClass,
              id_link_class: event.id,
              paymentCode: '',
              uid: this.state.uid,
              title: event.title
            }
          },
        });
      } else {
        if (now.getTime() < new Date(event.start).getTime()){
          alert('Lớp học chưa bắt đầu')
        }
        if(now.getTime() > new Date(event.end).getTime()){
          alert('Lớp học đã kết thúc')
        }
      }
      
    }
  };

  handlePricingClose = () => {
    this.setState({
      pricingModalOpen: false
    })
  };

  handleModalClose = () => {
    this.setState({
      eventModal: {
        open: false,
        event: null
      },
      confirmModal: {
        open: false,
        linkClass: null
      },
    });
  };

  handleEventNew = (event) => {
    this.setState({
      start : event.start,
      end: event.end,
      eventModal: {
        open: true,
        event: null
      }
    });
  };

  onAdd = async (event) => {
    const { start, end, title, publicFlag } = event
    let data = {
      start: new Date(start),
      end: new Date(end),
      title: title,
      linkClass: domain,
      publicFlag
    }
    const meeting = await db.collection(`link_class`).add(data)
    data = {...data, id: meeting.id}
    this.setState({
      events: [
        ...this.state.events,
        data
      ],
      eventModal: {
        open: false,
        event: null
      }
    });
    
  }
  onDelete = async (e) => {
    await db.collection(`link_class`).doc(e.id).delete();
    const events = this.state.events.filter(event => event.id !== e.id)
    this.setState({
      events,
      eventModal: {
        open: false,
        event: null
      }
    })
  }
  onEdit = (e) => {
    const newEvent = this.state.events
    const index = newEvent.findIndex(event => event.id === e.id)
    if( index !== -1) {
      db.collection(`link_class`).doc(e.id).set({
        linkClass: e.linkClass,
        title: e.title,
        start: new Date(e.start),
        end: new Date(e.end),
        publicFlag: e.publicFlag
      })
      newEvent[index] = {
        id: e.id,
        linkClass: e.linkClass,
        publicFlag: e.publicFlag,
        title: e.title,
        start: new Date(e.start),
        end: new Date(e.end),
      }
      this.setState({
        events: newEvent,
        eventModal: {
          open: false,
          event: null
        }
      })
    }
  }

  render(){
    return (
      <div style={{padding: '32px'}}>
        <Grid
          container
          spacing={4}
        >
          <Modal
            onClose={this.handleModalClose}
            open={this.state.confirmModal.open}
          >
            <ConfirmPayment
              event = {this.state.confirmModal.event}
              onCancel={this.handleModalClose}
            />
          </Modal>
          <Modal
            onClose={this.handleModalClose}
            open={this.state.eventModal.open}
          >
            <AddEvent
              publicFlag={this.state.publicFlag}
              start={this.state.start}
              end={this.state.end}
              event={this.state.eventModal.event}
              onAdd={this.onAdd}
              onCancel={this.handleModalClose}
              onDelete={this.onDelete}
              onEdit={this.onEdit}
            />
          </Modal>
          {
            this.state.uid ? 
            <Calendar
              defaultDate={new Date()}
              defaultView="week"
              events={this.state.events}
              localizer={localizer}
              onSelectEvent={this.handlePricingOpen}
              onSelectSlot={this.handleEventNew}
              selectable
              style={{ height: '80vh', width: '100vw'}}
            />
            :
            <Calendar
              defaultDate={new Date()}
              defaultView="week"
              events={this.state.events}
              localizer={localizer}
              onSelectEvent={this.handlePricingOpen}
              style={{ height: '80vh', width: '100vw'}}
            />
          }
        </Grid>
      </div>
    );
  }

}

export default ProductList;
