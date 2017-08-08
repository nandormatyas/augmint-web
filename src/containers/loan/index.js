import React from 'react'
import { Switch, Route } from 'react-router-dom'
import newLoanMain from './newLoan/';
import repayLoanMain from './repayLoan'
import loanDetails from './loanDetailsPage'
import collectLoanMain from './collectLoan'
import {PageNotFound} from 'containers/PageNotFound'


const LoanMain = () => (
        <Switch>
            <Route path='/loan/new' component={newLoanMain}/>
            <Route path='/loan/repay' component={repayLoanMain}/>
            <Route exact path='/loan/collect' component={collectLoanMain}/>
            <Route path='/loan/:loanId' component={loanDetails}/>
            <Route component={PageNotFound}/>
        </Switch>
)

export default LoanMain