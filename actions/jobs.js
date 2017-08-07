import axios from 'axios';
import qs from 'qs';

import {
  FETCH_JOBS,
  LIKE_JOB,
  CLEAR_LIKED_JOBS,
} from '../constants';

const JOBS_ROOT_URL = 'http://api.arbetsformedlingen.se/af/v0/platsannonser/';

const buildJobsUrl = (city, searchterm) => {
  const query = qs.stringify({ nyckelord: `${city} ${searchterm}` });
  return `${JOBS_ROOT_URL}matchning?${query}`;
};

const buildJobDetailsUrl = jobId => `${JOBS_ROOT_URL}${jobId}`;

const getCity = async ({ latitude, longitude }) => {
  const results = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}`);
  let city;

  results.data.results[0].address_components.forEach((e) => {
    if (e.types[0] === 'postal_town') {
      city = e.long_name;
    }
  });

  return city;
};

const getDetails = (results) => {
  const promises = results.map(async job => getJobDetails(job));
  return Promise.all(promises);
};

const getJobDetails = async (job) => {
  const url = buildJobDetailsUrl(job.annonsid);
  const { data } = await axios.get(url);
  return data.platsannons;
};

const getCoords = (jobs) => {
  const promises = jobs.map(async (job) => {
    const coords = await getJobCoords(job);
    return { ...job, coords };
  });
  return Promise.all(promises);
};

const getJobCoords = async (job) => {
  const { besoksadress, postnummer, postort } = job.arbetsplats;
  const query = qs.stringify({ address: `${besoksadress} ${postnummer} ${postort}` });
  const url = `https://maps.googleapis.com/maps/api/geocode/json?${query}`;
  const { data } = await axios.get(url);
  if (data.status === 'ZERO_RESULTS') {
    return { lng: 0, lat: 0 };
  }
  const coords = data.results[0].geometry.location;
  return coords;
};

export const fetchJobs = (region, searchterm, callback) => async (dispatch) => {
  try {
    const city = await getCity(region);
    const url = buildJobsUrl(city, searchterm);
    const { data } = await axios.get(url);
    let results = data.matchningslista.matchningdata;

    if (results === undefined) {
      dispatch({ type: FETCH_JOBS, payload: { results: [] } });
    }

    results = results.filter((job, i) => i < 10);
    const jobs = await getDetails(results);
    const jobsWithCoords = await getCoords(jobs);

    dispatch({ type: FETCH_JOBS, payload: { results: jobsWithCoords } });
    callback();
  } catch (err) {
    console.log(err);
  }
};

export const likeJob = job => ({
  type: LIKE_JOB,
  payload: job,
});

export const clearLikedJobs = () => ({ type: CLEAR_LIKED_JOBS });
