import ResultTemplate from '../components/resultTemplate';
import axios from 'axios';
import Router from 'next/router';

const configJson = import('../static/appConfig.json');

export default class RegisterResult extends React.Component {
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
    this.piIp = this.props.config.piIp;
    this.generateAge = this.generateAge.bind(this);
    this.getDaysInMonth = this.getDaysInMonth.bind(this);
    this.pageTimeout = null;
  }

  static async getInitialProps({ req, query }) {
    const config = await configJson
    return { config }
  }

  componentWillMount() {
    this.getPersonalData();
    this.pageTimeout = setTimeout(() => {
      Router.push('/');
    }, this.props.config.pageTimeout);
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
      console.log(err);
      this.getPersonalData();
    });
  }

  componentDidMount() {
    setTimeout(() => {
      Router.push('/weightAndHeight')
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
