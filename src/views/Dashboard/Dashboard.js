import React, { Component } from 'react';
import { Grid, Modal } from '@material-ui/core';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { Modal as Modal2 } from './components'
import {AddEvent } from '../UserList/components';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Base64 } from 'js-base64';
import sha1 from 'js-sha1';
import { db } from '../../config';

const SECRET = '8cd8ef52e8e101574e400365b55e11a6';
const domain  = 'https://meet.dasvision.vn';

const localizer = momentLocalizer(moment);

class Dashboard extends Component {
  constructor(props){
    super(props);
    this.state ={
      pricingModalOpen: false,
      eventModal: {
        open: false,
        event: null
      },
      linkClass: '',
      userName: '',
      uid: '',
      title: '',
      start : 0,
      end: 0,
      events: [],
      publicFlag: false
    }
  }

  componentDidMount(){
    const uid = localStorage.getItem('uid')
    const email = localStorage.getItem('email')
    if (uid) {
      this.setState({
        userName: email,
        uid
      })
      this.getCalender(uid)
    }else {
      alert('need login')
      this.props.history.push('/signin')
    }
  }

  async getCalender(uid) {
    const calender = await db.collection(`users/${uid}/calender`).get()
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

  handlePricingOpen = (event) => {
    this.setState({
      linkClass: event.linkClass,
      eventModal: {
        open: true,
        event: event
      },
      title: event.title
    });
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
      }
    });
  };

  handleEventNew = (event) => {
    console.log(event)
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
    const { uid, email } = this.state
    if (uid) {
      var timestample = new Date(start).getTime()/1000;
      var idClass = timestample;
      var slide = 'https://courses.emg.edu.vn:3443/courses/English/VirtualLessonCamels.pdf';
      var video = 'https://courses.emg.edu.vn:3443/courses/English/TheBactrianCamel.mp4';
      var CheckSumValue = sha1(`roomId=${idClass}&userId=123&userName=${Base64.encode(email)}&userRole=TEACHER&link_slide=${slide}&link_video=${video}&timeStartClass=${timestample}&secretValue=${SECRET}`)
      var token = Base64.encode(`roomId=${idClass}&userId=123&userName=${Base64.encode(email)}&userRole=TEACHER&link_slide=${slide}&link_video=${video}&timeStartClass=${timestample}&checkSum=${CheckSumValue}`)
      var linkgv = domain +'/'+idClass+'?token='+token;
      let data = {
        start: new Date(start),
        end: new Date(end),
        title: title,
        linkClass:linkgv,
        publicFlag
      }
      const collection = publicFlag ? 'linkClass' : `users/${uid}/calender`
      const meeting = await db.collection(collection).add(data)
      data = {...data, id: meeting.id}
      !publicFlag && 
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
    }else {
      alert('Need login')
      this.props.history.push('/signin')
    }
    
  }
  onDelete = async (e) => {
    console.log('onDelete', e)
    await db.collection(`users/${this.state.uid}/calender`).doc(e.id).delete();
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
      db.collection(`users/${this.state.uid}/calender`).doc(e.id).set({
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
          <Modal2
            onClose={this.handlePricingClose}
            open={this.state.pricingModalOpen}
            title = {this.state.title}
          >
            {this.state.linkClass}
          </Modal2>
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
          }
        </Grid>
      </div>
    );
  }

}

export default Dashboard;
