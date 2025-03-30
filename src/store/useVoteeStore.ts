import { create } from 'zustand';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

// ✅ Define Votee Type
interface Votee {
  id: string;
  name: string;
  region: string;
  categories: string[];
  message?: string;
  isClaimed: boolean;
  userId?: string;
}

// ✅ Zustand Store Interface
interface VoteeStore {
  votees: Votee[];
  fetchVotees: () => void;
  claimVotee: (voteeId: string, userId: string) => Promise<void>;
}

// ✅ Zustand Hook
export const useVoteeStore = create<VoteeStore>((set) => {
  const queryClient = useQueryClient();

  return {
    votees: [],

    // ✅ Fetch all Votees
    fetchVotees: () => {
      useQuery({
        queryKey: ['votees'],
        queryFn: async () => {
          try {
            const { data } = await axios.get('/api/votees');
            set({ votees: data });
            return data;
          } catch (error) {
            console.error('Error fetching votees:', error);
            toast.error('Failed to load votees.');
            throw error;
          }
        },
      });
    },

    // ✅ Claim a Votee
    claimVotee: async (voteeId: string, userId: string) => {
      try {
        await axios.post('/api/votees/claim', { voteeId, userId });
        toast.success('Votee claimed successfully!');

        // ✅ Invalidate & refetch votees
        queryClient.invalidateQueries({ queryKey: ['votees'] });
      } catch (error) {
        console.error('Error claiming votee:', error);
        toast.error('Failed to claim votee.');
      }
    },
  };
});
