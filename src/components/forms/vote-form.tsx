'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { MultiSelect } from '../multi-select';
import { useCategoryStore } from '@/store/useCategoryStore';

// ✅ Define props interface
interface VoteeFormData {
  name: string;
  message: string;
  categories: string[];
}

interface VoteeFormProps {
  onSubmit: (data: VoteeFormData) => void;
  pending: boolean;
}

const VoteForm: React.FC<VoteeFormProps> = ({ onSubmit, pending }) => {
  const { categories, fetchCategories } = useCategoryStore();
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // ✅ Fetch categories on mount
  useEffect(() => {
    fetchCategories().catch((err) => toast.error('Failed to load categories'));
  }, [fetchCategories]);

  // ✅ Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim() || !message.trim() || selectedCategories.length === 0) {
      toast.error(
        'Please fill in all fields and select at least one category.'
      );
      return;
    }

    try {
      onSubmit({
        name: name.trim(),
        message: message.trim(),
        categories: selectedCategories,
      });
      // setName('');
      // setMessage('');
      // setSelectedCategories([]);
      toast.success('Vote submitted successfully!');
    } catch (error) {
      toast.error('An error occurred while submitting the vote.');
    }
  };

  return (
    <Card className='w-full max-w-md mx-auto'>
      <CardHeader>
        <CardTitle>Votee Submission</CardTitle>
        <CardDescription>
          Fill out the form below to vote for the person.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className='space-y-4'>
          {/* Name Input */}
          <div className='space-y-2'>
            <Label htmlFor='name'>Name</Label>
            <Input
              id='name'
              placeholder='Enter name of the votee'
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Category Selection */}
          <div className='space-y-2'>
            <Label htmlFor='categories'>Categories</Label>
            <MultiSelect
              options={categories || []} // ✅ Handle missing categories
              onChange={(values) => setSelectedCategories(values)}
            />
          </div>

          {/* Message Input */}
          <div className='space-y-2'>
            <Label htmlFor='message'>Description</Label>
            <Textarea
              id='message'
              placeholder='Write description about the person'
              className='min-h-[120px]'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>
        </CardContent>

        {/* Submit Button */}
        <CardFooter>
          <Button type='submit' className='w-full' disabled={pending}>
            {pending ? 'Saving...' : 'Save'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default VoteForm;
