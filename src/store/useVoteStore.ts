import { create } from 'zustand';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

interface Vote {
  id: string;
  voterId?: string | null; // Can be `null` for anonymous votes
  message?: string;
  region: string;
  lat: number;
  lng: number;
  isAnonymous: boolean;
  createdAt: string;
}

interface VoteSupport {
  id: string;
  voterId?: string | null; // Can be `null` for anonymous users
  voteId: string;
  createdAt: string;
}

interface VoteStore {
  votes: Vote[];
  setVotes: (votes: Vote[]) => void;
}

export const useVoteStore = create<VoteStore>((set) => ({
  votes: [],
  setVotes: (votes) => set({ votes }),
}));

// ✅ Fetch Votes by Location
export const useFetchVotes = (lat: number, lng: number, radius: number) => {
  const setVotes = useVoteStore((state) => state.setVotes);

  return useQuery({
    queryKey: ['votes', lat, lng, radius],
    queryFn: async () => {
      const { data } = await axios.get(`/api/votes`, {
        params: { lat, lng, radius },
      });
      setVotes(data); // ✅ Store in Zustand
      return data;
    },
    enabled: !!lat && !!lng,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
};

// ✅ Create a Vote (No voteeId since Votee is created in backend)
export const useCreateVote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      name,
      region,
      categories,
      message,
      lat,
      lng,
      isAnonymous,
      voterId,
    }: {
      name: string;
      region: string;
      categories: string[];
      message: string;
      lat: number;
      lng: number;
      isAnonymous: boolean;
      voterId?: string;
    }) => {
      return await axios.post('/api/votes', {
        name,
        region,
        categories,
        message,
        lat,
        lng,
        isAnonymous,
        voterId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['votes'] });
    },
    onError: (error) => {
      console.error('Error creating vote:', error);
    },
  });
};

// ✅ Support an Existing Vote
export const useSupportVote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      voteId,
      voterId,
    }: {
      voteId: string;
      voterId?: string;
    }) => {
      return await axios.post('/api/vote-support', { voteId, voterId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['votes'] });
    },
    onError: (error) => {
      console.error('Error supporting vote:', error);
    },
  });
};
