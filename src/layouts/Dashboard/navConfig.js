import PeopleIcon from '@material-ui/icons/PeopleOutlined';
import DashboardIcon from '@material-ui/icons/DashboardOutlined';
import HomeIcon from '@material-ui/icons/HomeOutlined';
import SettingsIcon from '@material-ui/icons/SettingsOutlined';
import ListIcon from '@material-ui/icons/List';
import PersonIcon from '@material-ui/icons/PersonOutlined';

export default [
  {
    subheader: 'Pages',
    items: [      
      //***************************************************************************** */
      {
        title: '학생관리',
        href: 'student',
        icon: PeopleIcon,
        items:  [
          {
            title: '재학생 관리',
            href: '/student/list'
          },
          {
            title: '휴학생, 졸업생 관리',
            href: '/oldstudent/list'
          },
          {
            title: '학생 엑셀 업로드',
            href: '/student/excel'
          },
          {
            title: 'Paradox 학생정보',
            href: '/legacy/student/list'
          }
        ]
      },
      //***************************************************************************** */
         
      //***************************************************************************** */
      {
        title: '교사관리',
        href: 'teacher',
        icon: PersonIcon,
        items:  [
          {
            title: '현직교사 관리',
            href: '/teacher/list'
          }
        ]
      },
      //***************************************************************************** */
      {
        title: '학급관리',
        href: 'kurs',
        icon: HomeIcon,
        items:  [
          {
            title: '학기 관리',
            href: '/kurs/semester/list'
          },
          {
            title: '교실 관리',
            href: '/kurs/classroom/list'
          },
          {
            title: '신규학급 생성 및 관리',
            href: '/kurs/classinfo/list'
          },
          {
            title: '운영 학급  관리',
            href: '/kurs/operclass/list'
          },
          {
            title: '종료 학급  관리',
            href: '/kurs/endclass/list'
          }
        ]
      },      
      //***************************************************************************** */      
      
      {
        title: '수업료 및 문서관리',
        href: 'document',
        icon: ListIcon,
        items:  [
          {
            title: '수업료 납부현황',
            href: '/document/schoolfee/list'
          },
          {
            title: '수업료 납부',
            href: '/document/payment/list'
          },
          {
            title: '휴복학 처리 및 증명서 발급',
            href: '/document/student/list'
          }
        ]
      },      

      //***************************************************************************** */
      {
        title: '시스템 관리',
        href: 'system',
        icon: SettingsIcon,
        items:  [
          {
            title: '슈퍼 공통코드 관리',
            href: '/super/list'
          },
          {
            title: '공통코드 관리',
            href: '/code/list'
          },
          {
            title: '사용자 관리',
            href: '/user/list'
          },
          {
            title: '수업료 관리',
            href: '/schoolfee/list'
          },
          {
            title: '문서 관리',
            href: '/document/list'
          }
        ]
      },
      //***************************************************************************** */      
      {
        title: '통계',
        href: 'stats',
        icon: DashboardIcon,
        items:  [
          {
            title: '학기별 학급별 인원 현황',
            href: '/stats/semester/personal/list'
          },{
            title: '월별 수업료 합산',
            href: '/stats/monthly/schoolfee/sum/list'
          },
        ]
      },  
      //***************************************************************************** */      
    ]
  } 
];
