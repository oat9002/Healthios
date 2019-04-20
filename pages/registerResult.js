import React from 'react';
import ResultTemplate from '../components/resultTemplate';
import LoadingTemplate from '../components/loadingTemplate';
import axios from 'axios';
import Router, { withRouter } from 'next/router';
import * as Utils from '../services/Utils';
import * as Config from '../static/appConfig.json';

class RegisterResult extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      thaiName: '',
      engName: '',
      age: '',
      dateOfBirth: '',
      address: '',
      imgSrc: '',
      gender: '',
      idNumber: '',
      isLoading: true
    };
    this.piIp = Config.piIp;
    this.nextPageTimeout = null;
    this.pageTimeout = null;
    this.retryGetPersonalDataTimeOut = null;
    this.retryCount = 0;
  }

  getPersonalData = async() => {
    let url = this.piIp + '/thid';
    try {
      let res = await axios.get(url);

      if(res.data.status || this.retryCount === 10) {
        let data = res.data.data;
        this.setState({
          thaiName: data.thaiFullName,
          engName: data.engFullName,
          age: this.generateAge(data.birthOfDate),
          dateOfBirth: data.birthOfDate,
          address: data.address,
          gender: data.gender,
          idNumber: data.idNumber,
          isLoading: false
        });

        this.nextPageTimeout = setTimeout(() => {
          Router.replace('/camera');
        }, 5000);
      }
      else {
        this.retryCount++;
        this.retryGetPersonalData();
      }
    }
    catch(err) {
      Utils.sendLogMessage('Register result', err);
      this.retryGetPersonalData();
    }
  }

  componentDidMount() {
    this.getPersonalData();

    this.pageTimeout = setTimeout(() => {
      Router.replace('/');
    }, Config.pageTimeout);
  }

  componentWillUnmount() {
    clearTimeout(this.pageTimeout);
    clearTimeout(this.nextPageTimeout);
    clearTimeout(this.retryGetPersonalDataTimeOut);
  }

  getDaysInMonth = (month, year) => {
    return new Date(year, month, 0).getDate();
  }

  generateAge = (birthDate) => {
    let dateOfBirth = parseInt(birthDate.substring(0,2));
    let monthOfBirth = parseInt(birthDate.substring(3,5));
    let yearOfBirth = parseInt(birthDate.substring(6, birthDate.length));
    let currentDate = new Date();
    let ageYear = currentDate.getFullYear() - (yearOfBirth - 543);
    let ageMonth = 0;
    let ageDate = 0;
    if(currentDate.getMonth() + 1 > monthOfBirth) {
      ageMonth = currentDate.getMonth() + 1 - monthOfBirth;
      if(currentDate.getDate() < dateOfBirth) {
        ageDate = currentDate.getDate() - dateOfBirth + this.getDaysInMonth(currentDate.getMonth(), currentDate.getFullYear());
      }
      else {
        ageDate = currentDate.getDate() - dateOfBirth;
      }
    }
    else if(currentDate.getMonth() + 1 == monthOfBirth) {
      if(currentDate.getDate() < dateOfBirth) {
        ageYear = ageYear - 1;
        ageMonth = 11;
        ageDate = currentDate.getDate() - dateOfBirth + this.getDaysInMonth(currentDate.getMonth(), currentDate.getFullYear());
      }
      else {
        ageDate = currentDate.getDate() - dateOfBirth;
      }
    }
    else {
      ageYear = ageYear - 1;
      ageMonth = (currentDate.getMonth() + 13) - monthOfBirth;
      if(currentDate.getDate() < dateOfBirth) {
        ageDate = currentDate.getDate() - dateOfBirth + this.getDaysInMonth(currentDate.getMonth(), currentDate.getFullYear());
      }
      else {
        ageDate = currentDate.getDate() - dateOfBirth;
      }
    }
    return ageYear + ' ปี ' + ageMonth + ' เดือน ' + ageDate + ' วัน';
  }

  retryGetPersonalData = async() => {
    this.retryGetPersonalDataTimeOut = setTimeout(this.getPersonalData, Config.retryTimeout);
  }

  render() {
    return (
      <React.Fragment>
        {
          this.state.isLoading 
            ? <LoadingTemplate text='กำลังโหลดข้อมูล'></LoadingTemplate>
            : <ResultTemplate thaiName={this.state.thaiName} engName={this.state.engName} age={this.state.age} dateOfBirth={this.state.dateOfBirth} address={this.state.address} imgSrc={this.state.imgSrc} gender={this.state.gender} idNumber={this.state.idNumber}></ResultTemplate>
        }
      </React.Fragment>
    );
  }
}

export default withRouter(RegisterResult);