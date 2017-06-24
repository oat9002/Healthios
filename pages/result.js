import ResultTemplate from '../components/resultTemplate';

export default class extends React.Component {
  render() {
    return (
      <ResultTemplate thaiName='สรัล รักวิจิตรศิลป์' engName='Sarun Rakwijitsil' age={22} thaiDateOfBirth='1 ธ.ค. 2537' engDateOfBirth='1 Dec 1994' address='493 ซ.นาคบำรุง แขวงคลองมหานาค เขตป้อมปราบฯ' imgSrc='/static/pics/1.jpg'></ResultTemplate>
    );
  }
}
