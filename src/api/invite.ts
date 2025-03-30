import axios from 'axios';

// ✅ Fetch invitations for a votee
export const fetchInvitations = async (voteeId: string) => {
  const { data } = await axios.get(`/api/invitations?voteeId=${voteeId}`);
  return data;
};

// ✅ Invite a Votee
export const inviteVotee = async (
  voteeId: string,
  email: string,
  senderId?: string
) => {
  await axios.post('/api/invite-votee', {
    voteeId,
    recipientEmail: email,
    senderId,
  });
};

// ✅ Invite multiple Voters
export const inviteVoters = async (
  voteeId: string,
  emails: string[],
  senderId?: string
) => {
  await axios.post('/api/invite-voters', {
    voteeId,
    recipientEmails: emails,
    senderId,
  });
};
