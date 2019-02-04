import ResultTemplate from '../components/resultTemplate';
import axios from 'axios';
import Router, { withRouter } from 'next/router';
import * as Logging from '../services/logging';
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
      idNumber: ''
    };
    this.piIp = Config.piIp;
    this.generateAge = this.generateAge.bind(this);
    this.getDaysInMonth = this.getDaysInMonth.bind(this);
    this.pageTimeout = null;
  }

  componentWillMount() {
    this.getPersonalData();
    this.pageTimeout = setTimeout(() => {
      Router.replace('/');
    }, Config.pageTimeout);
  }

  getPersonalData = () => {
    let url = this.piIp + '/thid';
    axios.get(url).then(res => {
      if(res.data.status) {
        let data = res.data.data
        this.setState({
          thaiName: data.thaiFullName,
          engName: data.engFullName,
          age: this.generateAge(data.birthOfDate),
          dateOfBirth: data.birthOfDate,
          address: data.address,
          imgSrc: '/static/pics/1.jpg',
          gender: data.gender,
          idNumber: data.idNumber
        });
      }
    })
    .catch(err => {
      Logging.sendLogMessage('Register result', err);
      this.getPersonalData();
    });
  }

  componentDidMount() {
    setTimeout(() => {
      Router.replace('/weightAndHeight')
    }, 5000);
  }

  componentWillUnmount() {
    clearTimeout(this.pageTimeout);
  }

  getDaysInMonth(month,year) {
    return new Date(year, month, 0).getDate();
  }

  generateAge(birthDate) {
    let dateOfBirth = parseInt(birthDate.substring(0,2))
    let monthOfBirth = parseInt(birthDate.substring(3,5))
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

  render() {
    return (
      <ResultTemplate thaiName={this.state.thaiName} engName={this.state.engName} age={this.state.age} dateOfBirth={this.state.dateOfBirth} address={this.state.address} imgSrc={this.state.imgSrc} gender={this.state.gender} idNumber={this.state.idNumber}></ResultTemplate>
    );
  }
}

export default withRouter(RegisterResult)