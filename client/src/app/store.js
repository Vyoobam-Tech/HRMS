import {configureStore} from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import dashboardReducer from '../features/dashboardSlice'
import departmentReducer from '../features/department/departmentSlice'
import employeeReducer from '../features/employeeSlice'
import activityReducer from '../features/activitySlice'
import holidayReducer from '../features/holidaySlice'
import policyReducer from '../features/policySlice'
import namesReducer from '../features/manageSlice'
import attendanceReducer from '../features/attendanceSlice'
import attendanceSummaryReducer from '../features/attendanceSummarySlice'
import leaveSliceReducer from '../features/leaveSlice'
import leaveApplyReducer from '../features/leaveApplySlice'
import taskReducer from '../features/taskSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        dashboard: dashboardReducer,
        department: departmentReducer,
        employee: employeeReducer,
        activity: activityReducer,
        holiday: holidayReducer,
        policy: policyReducer,
        names: namesReducer,
        attendance: attendanceReducer,
        attendanceSummary:  attendanceSummaryReducer,
        leave: leaveSliceReducer,
        leaveApply: leaveApplyReducer,
        task: taskReducer
    }
})