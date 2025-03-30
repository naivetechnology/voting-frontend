import axios from 'axios';

// ✅ Fetch Votes near a location
export const fetchVotes = async (lat: number, lng: number, radius: number) => {
  const { data } = await axios.get(`/api/votes`, {
    params: { lat, lng, radius },
  });
  return data;
};

// ✅ Create a Vote
export const createVote = async (
  voteeId: string,
  message: string,
  region: string,
  lat: number,
  lng: number,
  isAnonymous: boolean
) => {
  await axios.post('/api/votes', {
    voteeId,
    message,
    region,
    lat,
    lng,
    isAnonymous,
  });
};

// ✅ Support an Existing Vote
export const supportVote = async (voteId: string, voterId?: string) => {
  await axios.post('/api/vote-support', { voteId, voterId });
};
