import ResultTemplate from '../components/resultTemplate';
import axios from 'axios';

const ip = 'http://161.246.6.201:8080';

export default class extends React.Component {
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
    this.generateAge = this.generateAge.bind(this);
  }

  componentWillMount() {
    let url = ip + '/thid';
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
    .catch(error => {
      console.log(error);
    });
  }

  generateAge(dateOfBirth) {
    let yearOfBirth = parseInt(dateOfBirth.substring(6, dateOfBirth.length));
    let currentDate = new Date();
    return currentDate.getFullYear() - (yearOfBirth - 543) + '';
  }

  render() {
    return (
      <ResultTemplate thaiName={this.state.thaiName} engName={this.state.engName} age={this.state.age} dateOfBirth={this.state.dateOfBirth} address={this.state.address} imgSrc={this.state.imgSrc} gender={this.state.gender} idNumber={this.state.idNumber}></ResultTemplate>
    );
  }
}
