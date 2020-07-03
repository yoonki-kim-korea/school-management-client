/* eslint-disable react/no-multi-comp */
/* eslint-disable react/display-name */
import React, { lazy } from 'react';
import { Redirect } from 'react-router-dom';
import AuthLayout from './layouts/Auth';
import ErrorLayout from './layouts/Error';
import DashboardLayout from './layouts/Dashboard';
import DashboardAnalyticsView from './views/DashboardAnalytics';
import DashboardDefaultView from './views/DashboardDefault';
import PresentationView from './views/Presentation';

export default [
  {
    path: '/',
    exact: true,
    component: () => <Redirect to="/auth/login" />
    //component: () => <Redirect to="/presentation" />
  },
  {
    path: '/auth',
    component: AuthLayout,
    routes: [
      {
        path: '/auth/login',
        exact: true,
        component: lazy(() => import('src/views/Login'))
      },
      {
        component: () => <Redirect to="/errors/error-404" />
      }
    ]
  },
  {
    path: '/errors',
    component: ErrorLayout,
    routes: [
      {
        path: '/errors/error-401',
        exact: true,
        component: lazy(() => import('src/views/Error401'))
      },
      {
        path: '/errors/error-404',
        exact: true,
        component: lazy(() => import('src/views/Error404'))
      },
      {
        path: '/errors/error-500',
        exact: true,
        component: lazy(() => import('src/views/Error500'))
      },
      {
        component: () => <Redirect to="/errors/error-404" />
      }
    ]
  },
  {
    route: '*',
    component: DashboardLayout,
    routes: [
      {
        path: '/calendar',
        exact: true,
        component: lazy(() => import('src/views/Calendar'))
      },
 
      {
        path: '/dashboards/analytics',
        exact: true,
        component: DashboardAnalyticsView
      },
      {
        path: '/dashboards/default',
        exact: true,
        component: DashboardDefaultView
      },
      
      /****************************************************
       * 수업관리 > 학기관리
       ****************************************************/
      {
        path: '/kurs/semester/list/',
        exact: true,
        component: lazy(() => import('src/views/Kurs/Semester'))
      },
      {
        path: '/kurs/classroom/list/',
        exact: true,
        component: lazy(() => import('src/views/Kurs/Classroom'))
      },
      {
        path: '/kurs/classinfo/list/',
        exact: true,
        component: lazy(() => import('src/views/Kurs/Classinfo'))
      },
      {
        path: '/kurs/operclass/list/',
        exact: true,
        component: lazy(() => import('src/views/Kurs/OperClass'))
      },
      {
        path: '/kurs/operclass/view/:classId/:classType',
        exact: true,
        component: lazy(() => import('src/views/Kurs/OperClass/View'))
      },
      {
        path: '/kurs/diary/list/',
        exact: true,
        component: lazy(() => import('src/views/Kurs/OperClass/Diary'))
      },
      {
        path: '/kurs/diary/list/:studentId',
        exact: true,
        component: lazy(() => import('src/views/Kurs/OperClass/Diary'))
      },
      {
        path: '/kurs/endclass/list/',
        exact: true,
        component: lazy(() => import('src/views/Kurs/EndClass'))
      },
      {
        path: '/kurs/endclass/view/:classId/:classType',
        exact: true,
        component: lazy(() => import('src/views/Kurs/EndClass/View'))
      },

      /****************************************************
       * 공통코드
       ****************************************************/
      {
        path: '/code/list/',
        exact: true,
        component: lazy(() => import('src/views/Code/Code'))
      },
      {
        path: '/code/list/:callSuperCodeId',
        exact: true,
        component: lazy(() => import('src/views/Code/Code'))
      },
      {
        path: '/super/list',
        exact: true,
        component: lazy(() => import('src/views/Code/Super'))
      },      

      /****************************************************
       * 사용자
       ****************************************************/
      {
        path: '/user/list/',
        exact: true,
        component: lazy(() => import('src/views/System/User'))
      },
      {
        path: '/user/list/:userId',
        exact: true,
        component: lazy(() => import('src/views/System/User'))
      },   

      /****************************************************
       * 수업료
       ****************************************************/
      {
        path: '/schoolfee/list/',
        exact: true,
        component: lazy(() => import('src/views/System/Schoolfee'))
      },
      {
        path: '/schoolfee/list/:userId',
        exact: true,
        component: lazy(() => import('src/views/System/Schoolfee'))
      },

      /****************************************************
       * 교사 > 교사관리
       ****************************************************/
      {
        path: '/teacher/list',
        exact: true,
        component: lazy(() => import('src/views/Teacher/List'))
      },
      {
        path: '/teacher/list/:teacherId',
        exact: true,
        component: lazy(() => import('src/views/Teacher/List'))
      },
      
      /****************************************************
       * 교사 > 입력
       ****************************************************/
      {
        path: '/teacher/insert/:tab',
        exact: true,
        component: lazy(() => import('src/views/Teacher/Insert'))
      },

      /****************************************************
       * 교사 > 상세보기
       ****************************************************/
      {
        path: '/teacher/view/',
        exact: true,
        component: lazy(() => import('src/views/Teacher/View'))
      },

      {
        path: '/teacher/view/:teacherId',
        exact: true,
        component: lazy(() => import('src/views/Teacher/View'))
      },
      {
        path: '/teacher/view/:teacherId/:tab',
        exact: true,
        component: lazy(() => import('src/views/Teacher/View'))
      },

      /****************************************************
       * 학생 > 재학생관리
       ****************************************************/
      {
        path: '/student/list',
        exact: true,
        component: lazy(() => import('src/views/Student/List'))
      },
      {
        path: '/student/list/:studentId',
        exact: true,
        component: lazy(() => import('src/views/Student/List'))
      },

      /****************************************************
       * 학생 > 휴학생 졸업생 관리
       ****************************************************/
      {
        path: '/oldstudent/list',
        exact: true,
        component: lazy(() => import('src/views/OldStudent/List'))
      },
      {
        path: '/oldstudent/list/:studentId',
        exact: true,
        component: lazy(() => import('src/views/OldStudent/List'))
      },
      {
        path: '/oldstudent/view/:studentId',
        exact: true,
        component: lazy(() => import('src/views/OldStudent/View'))
      },
      {
        path: '/oldstudent/view/:studentId/:tab',
        exact: true,
        component: lazy(() => import('src/views/OldStudent/View'))
      },

      /****************************************************
       * 학생 > paradox 학생정보
       ****************************************************/
      {
        path: '/legacy/student/list',
        exact: true,
        component: lazy(() => import('src/views/Paradox/List'))
      },
      {
        path: '/legacy/student/view/',
        exact: true,
        component: lazy(() => import('src/views/Paradox/View'))
      },
      {
        path: '/legacy/student/view/:sid',
        exact: true,
        component: lazy(() => import('src/views/Paradox/View'))
      },
      {
        path: '/legacy/student/view/:sid/:tab',
        exact: true,
        component: lazy(() => import('src/views/Paradox/View'))
      },

      /****************************************************
       * 학생 > 엑셀 업로드
       ****************************************************/
      {
        path: '/student/excel',
        exact: true,
        component: lazy(() => import('src/views/Student/Excel'))
      },

      /****************************************************
       * 학생 > 입력
       ****************************************************/
      {
        path: '/student/insert/:tab',
        exact: true,
        component: lazy(() => import('src/views/Student/Insert'))
      },

      /****************************************************
       * 학생 > 상세보기
       ****************************************************/
      {
        path: '/student/view/:studentId',
        exact: true,
        component: lazy(() => import('src/views/Student/View'))
      },
      {
        path: '/student/view/:studentId/:tab',
        exact: true,
        component: lazy(() => import('src/views/Student/View'))
      },

      /****************************************************
       * 수업료 및 문서관리 > 수업료 납부현황
       ****************************************************/
      {
        path: '/document/schoolfee/list',
        exact: true,
        component: lazy(() => import('src/views/Document/Schoolfee/List'))
      },

      /****************************************************
       * 수업료 및 문서관리 > 수업료 납부
       ****************************************************/
      {
        path: '/document/payment/list',
        exact: true,
        component: lazy(() => import('src/views/Document/Payment/List'))
      },,

      /****************************************************
       * 수업료 및 문서관리 > 휴복학 처리 및 증명서 발급
       ****************************************************/
      {
        path: '/document/student/list',
        exact: true,
        component: lazy(() => import('src/views/Document/Student/List'))
      },

      /****************************************************
       * 시스템관리 > 문서관리
       ****************************************************/
      {
        path: '/document/list',
        exact: true,
        component: lazy(() => import('src/views/System/Document'))
      },

      /****************************************************
       * 통계 > 학기별 학급별 인원 현황
       ****************************************************/
      {
        path: '/stats/semester/personal/list',
        exact: true,
        component: lazy(() => import('src/views/Stats/SemesterPersonal/List'))
      },

      /****************************************************
       * 통계 > 월별 수업료 합산
       ****************************************************/
      {
        path: '/stats/monthly/schoolfee/sum/list',
        exact: true,
        component: lazy(() => import('src/views/Stats/MonthlySchoolfeeSum/List'))
      },

      {
        path: '/presentation',
        exact: true,
        component: PresentationView
      },

      {
        path: '/settings',
        exact: true,
        component: lazy(() => import('src/views/Settings'))
      },
      {
        path: '/settings/:tab',
        exact: true,
        component: lazy(() => import('src/views/Settings'))
      },

      {
        path: '/getting-started',
        exact: true,
        component: lazy(() => import('src/views/GettingStarted'))
      },
      {
        component: () => <Redirect to="/errors/error-404" />
      }
    ]
  }
];
