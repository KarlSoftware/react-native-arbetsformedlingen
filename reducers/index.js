import { combineReducers } from 'redux';
import jobs from './jobs';
import likedJobs from './likes';

export default combineReducers({
  jobs,
  likedJobs,
});
