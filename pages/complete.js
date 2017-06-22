import React from 'react';

export default class Complete extends React.Component {
  render() {
    return (
      <div className='content'>
        <span>ลงทะเบียนสำเร็จแล้ว!<img src="/static/pics/correct.svg" /></span>
        <style jsx>{`
          .content {
            font-size: 60px;
            text-align: center;
            margin-top: 20%
          }
          img {
            vertical-align:middle
          }
        `}</style>
        <style jsx global>{`
          body {
            font-family: Kanit Light;
            color: #393939;
            background-color: #f7f7f7;
          }
        `}</style>
      </div>
    );
  }
}
