import React, { Component } from 'react';
import axios from 'axios';
import Moment from 'react-moment';
import { Image, Panel, Col, Well, Modal, Button, Glyphicon, Collapse } from 'react-bootstrap';
import GoogleMap from '../features/map/GoogleMap';

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      profileUrl: '',
      joinedOn: '',
      email: '',
      userId: '',
      phone: '',
      list: '',
      review_body: [],
      events: [],
      organized_events: [],
      eventObjArr: [],
      showModal: false,
      showContact: false,
      showEvents: false,
    };
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.openContact = this.openContact.bind(this);
    this.closeContact = this.closeContact.bind(this);
    this.openEvents = this.openEvents.bind(this);
    this.closeEvents = this.closeEvents.bind(this);
  }

  componentDidMount() {
    axios.get('/users/id')
      .then(res => {
        const name = `${res.data.first_name} ${res.data.last_name}`;
        const email = res.data.email;
        const area = res.data.area;
        const phone = res.data.phone;
        const profileUrl = res.data.profile_photo_url;
        const joinedOn = res.data.created_at.slice(0, 10);
        const userId = res.data.id;
        this.setState({ name, profileUrl, joinedOn, email, userId, area, phone });
        axios.get(`/reviews/user/${this.state.userId}`)
          .then(res => {
            this.setState({
              review_body: res.data,
            });
          });
        axios.get(`/users_events/user/${this.state.userId}`)
          .then(res => {
            const events = [];
            // eslint-disable-next-line array-callback-return
            res.data.map(item => {
              events.push(item.event_id);
            });
            this.setState({ events });
            const promises = this.state.events.map(item =>
              axios.get(`/events/event/${item}`));


            Promise.all(promises).then(res => {
              const eventObjArr = res.map(item => item.data[0]);
              this.setState({
                eventObjArr,
              });
            });
          });
      });
  }

  close() {
    this.setState({ showModal: false });
  }

  open() {
    this.setState({ showModal: true });
  }

  openContact() {
    this.setState({ showContact: true });
  }

  closeContact() {
    this.setState({ showContact: false });
  }

  openEvents() {
    this.setState({ showEvents: true });
  }

  closeEvents() {
    this.setState({ showEvents: false });
  }

  render() {
    return (
      <div className="container">
        <Well style={{ backgroundImage: 'url(http://res.cloudinary.com/dk5dqve4y/image/upload/c_scale,h_291,q_20,w_1140/v1491267783/AdobeStock_93889805_cn6fbz.jpg)' }}>
          <center>
            <Image
              thumbnail
              responsive
              rounded
              src={this.state.profileUrl}
              width="150"
              height="150"
            />
            <h3 style={{ color: 'white' }}>{this.state.name}</h3>
          </center>
        </Well>

        <div className="well" style={{ maxWidth: 400, margin: '0 auto 10px' }}>
          { this.state.review_body.length
            ? <Button
              block
              bsStyle="default"
              bsSize="small"
              onClick={this.open}
            >
              My Trail Reviews
            </Button>
            : null
          }

          <Button
            block
            bsStyle="default"
            bsSize="small"
            onClick={this.openContact}
          >
            My Contact Info
          </Button>

          { this.state.eventObjArr.length
            ? <Button
              block
              bsStyle="default"
              bsSize="small"
              onClick={this.openEvents}
            >
              Upcoming Adventures
            </Button>
            : null
          }
        </div>


        <Modal show={this.state.showModal} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title style={{ textAlign: 'center' }}>{`${this.state.name}'s`} Trail Reviews</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            { this.state.review_body
              && this.state.review_body.map(item =>
                <div key={item.id}>
                  <Panel
                    header={<strong>{item.name}</strong>}
                    footer={<date>
                      <small>
                        <Moment tz="America/Los_Angeles">
                          {item.created_at}
                        </Moment>
                      </small>
                    </date>}
                  >
                    <Col>
                      <p>
                        <em>{item.review_body}</em>
                      </p>

                    </Col>
                  </Panel>
                </div>)
            }
          </Modal.Body>
          <Modal.Footer>
            <Button bsStyle="danger" onClick={this.close}>Close</Button>
          </Modal.Footer>
        </Modal>

        <Modal show={this.state.showContact} onHide={this.closeContact}>
          <Modal.Header closeButton>
            <Modal.Title style={{ textAlign: 'center' }}>{`${this.state.name}'s`} Contact Information</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p><a href={'mailto:' + this.state.email}><Glyphicon glyph="envelope" />  {this.state.email}</a></p>
            <p>
              <Glyphicon glyph="phone" />  ({this.state.phone.slice(0, 3)}) {this.state.phone.slice(3, 6)} - {this.state.phone.slice(6, 10)}
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
              <a href="http://facebook.com" className="btn btn-social-icon btn-facebook"><i className="fa fa-facebook" /></a>
              <a className="btn btn-social-icon btn-github"><i className="fa fa-github" /></a>
              <a className="btn btn-social-icon btn-google-plus">
                <i className="fa fa-google-plus" />
              </a>
              <a className="btn btn-social-icon btn-instagram"><i className="fa fa-instagram" /></a>
              <a className="btn btn-social-icon btn-linkedin"><i className="fa fa-linkedin" /></a>
              <a className="btn btn-social-icon btn-twitter"><i className="fa fa-twitter" /></a>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button bsStyle="danger" onClick={this.closeContact}>Close</Button>
          </Modal.Footer>
        </Modal>

        <Modal show={this.state.showEvents} onHide={this.closeEvents}>
          <Modal.Header closeButton>
            <Modal.Title style={{ textAlign: 'center' }}>{this.state.name}'s Upcoming Adventures</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {
             this.state.eventObjArr.length > 0
             ? this.state.eventObjArr.map(item =>
               <Panel
                 header={<div>
                   <strong>{item.trail_name} </strong>
                   <div>
                     <small>
                       <Moment
                         format="MM/DD/YYYY"
                         tz="America/Los_Angeles"
                       >
                         {item.event_date}
                       </Moment> {item.event_time}
                     </small>
                   </div>
                 </div>}
               >
                 <div style={{ height: '300px', border: '1px solid grey' }}>
                   <GoogleMap
                     lat={parseFloat(item.latitude, 10)} lng={parseFloat(item.longitude, 10)}
                   />
                 </div>
                 <div style={{ display: 'flex', justifyContent: 'center' }}>
                   <Image thumbnail src={item.profile_photo_url} style={{ height: '100px', width: '100px', marginTop: '1%' }} />
                 </div>
                 <div style={{ display: 'flex', justifyContent: 'center' }}><p>{item.first_name} {item.last_name}</p></div>

                 <p><strong>Max Participants:</strong> {item.max_participants}</p>
                 <p><strong>Organizer:</strong> {item.first_name} {item.last_name}</p>
                 <p><strong>Organizer Email:</strong> {item.email}</p>
                 <p>
                   <strong>Organizer Phone: </strong>
                   ({item.phone.slice(0, 3)}) {item.phone.slice(3, 6)} - {item.phone.slice(6, 10)}
                 </p>
                 <p><strong>Region:</strong> {item.region}</p>
                 <p><strong>Elevation Gain:</strong> {item.elevation_gain}</p>
                 <p><strong>Coordinates:</strong> {item.latitude}, {item.longitude}</p>
                 <p><strong>Features:</strong> {item.features.replace(/{/, '').replace(/}/, '').replace(/"/g, '').replace(/,/g, ', ')}</p>
                 <p><strong>Highest Point:</strong> {item.highest_point}</p>
                 { item.driving_directions
                      && <p>
                        <strong>Driving Directions:</strong>
                        <div style={{ display: 'inline' }}>
                          <Button
                            bsSize="xsmall"
                            onClick={() => this.setState({
                              openDirections: !this.state.openDirections,
                            })}
                          >
                            Directions
                          </Button>
                          <Collapse in={this.state.openDirections}>
                            <div>
                              <Well>
                                {item.driving_directions}
                              </Well>
                            </div>
                          </Collapse>
                        </div>
                      </p>
                  }
                 { item.trail_description
                      ? <p>
                        <strong>Trail Description: </strong>
                        <div style={{ display: 'inline' }}>
                          <Button
                            bsSize="xsmall"
                            onClick={() => this.setState({
                              open: !this.state.open,
                            })}
                          >
                            Details
                          </Button>
                          <Collapse in={this.state.open}>
                            <div>
                              <Well>
                                {item.trail_description}
                              </Well>
                            </div>
                          </Collapse>
                        </div>
                      </p>
                    : null
                  }
               </Panel>,
     )
     : null
   }
          </Modal.Body>
          <Modal.Footer>
            <Button bsStyle="danger" onClick={this.closeEvents}>Close</Button>
          </Modal.Footer>


        </Modal>
        <style>{`
          @import url('https://fonts.googleapis.com/css?family=Raleway');
          .btn-social{position:relative;padding-left:44px;text-align:left;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.btn-social :first-child{position:absolute;left:0;top:0;bottom:0;width:32px;line-height:34px;font-size:1.6em;text-align:center;border-right:1px solid rgba(0,0,0,0.2)}
          .btn-social.btn-lg{padding-left:61px}.btn-social.btn-lg :first-child{line-height:45px;width:45px;font-size:1.8em}
          .btn-social.btn-sm{padding-left:38px}.btn-social.btn-sm :first-child{line-height:28px;width:28px;font-size:1.4em}
          .btn-social.btn-xs{padding-left:30px}.btn-social.btn-xs :first-child{line-height:20px;width:20px;font-size:1.2em}
          .btn-social-icon{position:relative;padding-left:44px;text-align:left;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;height:34px;width:34px;padding:0}.btn-social-icon :first-child{position:absolute;left:0;top:0;bottom:0;width:32px;line-height:34px;font-size:1.6em;text-align:center;border-right:1px solid rgba(0,0,0,0.2)}
          .btn-social-icon.btn-lg{padding-left:61px}.btn-social-icon.btn-lg :first-child{line-height:45px;width:45px;font-size:1.8em}
          .btn-social-icon.btn-sm{padding-left:38px}.btn-social-icon.btn-sm :first-child{line-height:28px;width:28px;font-size:1.4em}
          .btn-social-icon.btn-xs{padding-left:30px}.btn-social-icon.btn-xs :first-child{line-height:20px;width:20px;font-size:1.2em}
          .btn-social-icon :first-child{border:none;text-align:center;width:100% !important}
          .btn-social-icon.btn-lg{height:45px;width:45px;padding-left:0;padding-right:0}
          .btn-social-icon.btn-sm{height:30px;width:30px;padding-left:0;padding-right:0}
          .btn-social-icon.btn-xs{height:22px;width:22px;padding-left:0;padding-right:0}
          .btn-facebook{color:#fff;background-color:#3b5998;border-color:rgba(0,0,0,0.2)}.btn-facebook:hover,.btn-facebook:focus,.btn-facebook:active,.btn-facebook.active,.open .dropdown-toggle.btn-facebook{color:#fff;background-color:#30487b;border-color:rgba(0,0,0,0.2)}
          .btn-facebook:active,.btn-facebook.active,.open .dropdown-toggle.btn-facebook{background-image:none}
          .btn-facebook.disabled,.btn-facebook[disabled],fieldset[disabled] .btn-facebook,.btn-facebook.disabled:hover,.btn-facebook[disabled]:hover,fieldset[disabled] .btn-facebook:hover,.btn-facebook.disabled:focus,.btn-facebook[disabled]:focus,fieldset[disabled] .btn-facebook:focus,.btn-facebook.disabled:active,.btn-facebook[disabled]:active,fieldset[disabled] .btn-facebook:active,.btn-facebook.disabled.active,.btn-facebook[disabled].active,fieldset[disabled] .btn-facebook.active{background-color:#3b5998;border-color:rgba(0,0,0,0.2)}
          .btn-github{color:#fff;background-color:#444;border-color:rgba(0,0,0,0.2)}.btn-github:hover,.btn-github:focus,.btn-github:active,.btn-github.active,.open .dropdown-toggle.btn-github{color:#fff;background-color:#303030;border-color:rgba(0,0,0,0.2)}
          .btn-github:active,.btn-github.active,.open .dropdown-toggle.btn-github{background-image:none}
          .btn-github.disabled,.btn-github[disabled],fieldset[disabled] .btn-github,.btn-github.disabled:hover,.btn-github[disabled]:hover,fieldset[disabled] .btn-github:hover,.btn-github.disabled:focus,.btn-github[disabled]:focus,fieldset[disabled] .btn-github:focus,.btn-github.disabled:active,.btn-github[disabled]:active,fieldset[disabled] .btn-github:active,.btn-github.disabled.active,.btn-github[disabled].active,fieldset[disabled] .btn-github.active{background-color:#444;border-color:rgba(0,0,0,0.2)}
          .btn-google-plus{color:#fff;background-color:#dd4b39;border-color:rgba(0,0,0,0.2)}.btn-google-plus:hover,.btn-google-plus:focus,.btn-google-plus:active,.btn-google-plus.active,.open .dropdown-toggle.btn-google-plus{color:#fff;background-color:#ca3523;border-color:rgba(0,0,0,0.2)}
          .btn-google-plus:active,.btn-google-plus.active,.open .dropdown-toggle.btn-google-plus{background-image:none}
          .btn-google-plus.disabled,.btn-google-plus[disabled],fieldset[disabled] .btn-google-plus,.btn-google-plus.disabled:hover,.btn-google-plus[disabled]:hover,fieldset[disabled] .btn-google-plus:hover,.btn-google-plus.disabled:focus,.btn-google-plus[disabled]:focus,fieldset[disabled] .btn-google-plus:focus,.btn-google-plus.disabled:active,.btn-google-plus[disabled]:active,fieldset[disabled] .btn-google-plus:active,.btn-google-plus.disabled.active,.btn-google-plus[disabled].active,fieldset[disabled] .btn-google-plus.active{background-color:#dd4b39;border-color:rgba(0,0,0,0.2)}
          .btn-instagram{color:#fff;background-color:#3f729b;border-color:rgba(0,0,0,0.2)}.btn-instagram:hover,.btn-instagram:focus,.btn-instagram:active,.btn-instagram.active,.open .dropdown-toggle.btn-instagram{color:#fff;background-color:#335d7e;border-color:rgba(0,0,0,0.2)}
          .btn-instagram:active,.btn-instagram.active,.open .dropdown-toggle.btn-instagram{background-image:none}
          .btn-instagram.disabled,.btn-instagram[disabled],fieldset[disabled] .btn-instagram,.btn-instagram.disabled:hover,.btn-instagram[disabled]:hover,fieldset[disabled] .btn-instagram:hover,.btn-instagram.disabled:focus,.btn-instagram[disabled]:focus,fieldset[disabled] .btn-instagram:focus,.btn-instagram.disabled:active,.btn-instagram[disabled]:active,fieldset[disabled] .btn-instagram:active,.btn-instagram.disabled.active,.btn-instagram[disabled].active,fieldset[disabled] .btn-instagram.active{background-color:#3f729b;border-color:rgba(0,0,0,0.2)}
          .btn-linkedin{color:#fff;background-color:#007bb6;border-color:rgba(0,0,0,0.2)}.btn-linkedin:hover,.btn-linkedin:focus,.btn-linkedin:active,.btn-linkedin.active,.open .dropdown-toggle.btn-linkedin{color:#fff;background-color:#005f8d;border-color:rgba(0,0,0,0.2)}
          .btn-linkedin:active,.btn-linkedin.active,.open .dropdown-toggle.btn-linkedin{background-image:none}
          .btn-linkedin.disabled,.btn-linkedin[disabled],fieldset[disabled] .btn-linkedin,.btn-linkedin.disabled:hover,.btn-linkedin[disabled]:hover,fieldset[disabled] .btn-linkedin:hover,.btn-linkedin.disabled:focus,.btn-linkedin[disabled]:focus,fieldset[disabled] .btn-linkedin:focus,.btn-linkedin.disabled:active,.btn-linkedin[disabled]:active,fieldset[disabled] .btn-linkedin:active,.btn-linkedin.disabled.active,.btn-linkedin[disabled].active,fieldset[disabled] .btn-linkedin.active{background-color:#007bb6;border-color:rgba(0,0,0,0.2)}
          .btn-twitter{color:#fff;background-color:#55acee;border-color:rgba(0,0,0,0.2)}.btn-twitter:hover,.btn-twitter:focus,.btn-twitter:active,.btn-twitter.active,.open .dropdown-toggle.btn-twitter{color:#fff;background-color:#309aea;border-color:rgba(0,0,0,0.2)}
          .btn-twitter:active,.btn-twitter.active,.open .dropdown-toggle.btn-twitter{background-image:none}
          .btn-twitter.disabled,.btn-twitter[disabled],fieldset[disabled] .btn-twitter,.btn-twitter.disabled:hover,.btn-twitter[disabled]:hover,fieldset[disabled] .btn-twitter:hover,.btn-twitter.disabled:focus,.btn-twitter[disabled]:focus,fieldset[disabled] .btn-twitter:focus,.btn-twitter.disabled:active,.btn-twitter[disabled]:active,fieldset[disabled] .btn-twitter:active,.btn-twitter.disabled.active,.btn-twitter[disabled].active,fieldset[disabled] .btn-twitter.active{background-color:#55acee;border-color:rgba(0,0,0,0.2)}
          a {
            text-decoration: none;
          }

          body {
            font-family: 'Raleway', sans-serif;
          }
        `}</style>
      </div>
    );
  }
}

export default Profile;
