import React, { useState } from 'react';
import { Calendar, Upload, Clock, Image as ImageIcon } from 'lucide-react';
import TextArea from '../ui/TextArea';
import Button from '../ui/Button';
import Checkbox from '../ui/Checkbox';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/Card';
import { SocialPlatform, ThemeProps } from '../../types';
import Input from '../ui/Input';

interface PostCreationFormProps extends ThemeProps {
  onPublish: (content: string, platforms: SocialPlatform[], scheduledDate?: Date, image?: File) => void;
}

const PostCreationForm: React.FC<PostCreationFormProps> = ({ onPublish, isDarkMode }) => {
  const [content, setContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialPlatform[]>([]);
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePlatformToggle = (platform: SocialPlatform) => {
    if (selectedPlatforms.includes(platform)) {
      setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform));
    } else {
      setSelectedPlatforms([...selectedPlatforms, platform]);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content || selectedPlatforms.length === 0) {
      alert("Please enter content and select at least one platform");
      return;
    }

    setIsSubmitting(true);

    let scheduledDateTime: Date | undefined;
    if (isScheduling && scheduledDate && scheduledTime) {
      scheduledDateTime = new Date(`${scheduledDate}T${scheduledTime}`);
    }

    // Simulate submission
    setTimeout(() => {
      onPublish(content, selectedPlatforms, scheduledDateTime, imageFile || undefined);
      setIsSubmitting(false);
      
      // Reset form
      setContent('');
      setSelectedPlatforms([]);
      setIsScheduling(false);
      setScheduledDate('');
      setScheduledTime('');
      setImageFile(null);
      setImagePreview(null);
    }, 1000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create a Post</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Post Content
          </label>
          <textarea
            id="content"
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
              isDarkMode ? 'dark:bg-gray-800 dark:text-white dark:border-gray-700' : ''
            }`}
            placeholder="What's on your mind?"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select Platforms
          </label>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {['facebook', 'twitter', 'instagram', 'linkedin', 'threads'].map((platform) => (
              <label
                key={platform}
                className={`relative flex cursor-pointer rounded-lg border p-4 shadow-sm focus:outline-none ${
                  selectedPlatforms.includes(platform as SocialPlatform)
                    ? 'border-indigo-500 ring-2 ring-indigo-500'
                    : 'border-gray-300 dark:border-gray-700'
                } ${
                  isDarkMode ? 'dark:bg-gray-800' : 'bg-white'
                }`}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={selectedPlatforms.includes(platform as SocialPlatform)}
                  onChange={() => handlePlatformToggle(platform as SocialPlatform)}
                />
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center">
                    <div className="text-sm">
                      <p className={`font-medium ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {platform.charAt(0).toUpperCase() + platform.slice(1)}
                      </p>
                    </div>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="scheduledDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Schedule Post (Optional)
            </label>
            <Input
              type="datetime-local"
              id="scheduledDate"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className={isDarkMode ? 'dark:bg-gray-800 dark:text-white dark:border-gray-700' : ''}
            />
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Add Image (Optional)
            </label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              className={`mt-1 block w-full text-sm text-gray-500 dark:text-gray-400
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-indigo-50 file:text-indigo-700
                dark:file:bg-indigo-900 dark:file:text-indigo-300
                hover:file:bg-indigo-100 dark:hover:file:bg-indigo-800`}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" isLoading={isSubmitting}>
            {scheduledDate ? 'Schedule Post' : 'Publish Now'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default PostCreationForm;