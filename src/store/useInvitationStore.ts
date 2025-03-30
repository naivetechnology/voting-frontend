import { create } from 'zustand';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

interface Invitation {
  id: string;
  senderId?: string | null;
  recipientEmail: string;
  voteeId: string;
  status: string;
  sentAt: string;
}

interface InvitationStore {
  invitations: Invitation[];
  fetchInvitations: (voteeId: string) => void;
  inviteVotee: (
    voteeId: string,
    email: string,
    senderId?: string
  ) => Promise<void>;
  inviteVoters: (
    voteeId: string,
    emails: string[],
    senderId?: string
  ) => Promise<void>;
}

export const useInvitationStore = create<InvitationStore>((set) => {
  const queryClient = useQueryClient();

  return {
    invitations: [],

    // ✅ Fetch all invitations for a votee
    fetchInvitations: (voteeId: string) => {
      useQuery({
        queryKey: ['invitations', voteeId],
        queryFn: async () => {
          const { data } = await axios.get(
            `/api/invitations?voteeId=${voteeId}`
          );
          set({ invitations: data });
          return data;
        },
        enabled: !!voteeId,
      });
    },

    // ✅ Invite a Votee to claim their profile
    inviteVotee: async (voteeId, email, senderId) => {
      const mutation = useMutation({
        mutationFn: async () => {
          await axios.post('/api/invite-votee', {
            voteeId,
            recipientEmail: email,
            senderId,
          });
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['invitations', voteeId] });
        },
      });

      return mutation.mutateAsync();
    },

    // ✅ Invite multiple Voters to vote
    inviteVoters: async (voteeId, emails, senderId) => {
      const mutation = useMutation({
        mutationFn: async () => {
          await axios.post('/api/invite-voters', {
            voteeId,
            recipientEmails: emails,
            senderId,
          });
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['invitations', voteeId] });
        },
      });

      return mutation.mutateAsync();
    },
  };
});
