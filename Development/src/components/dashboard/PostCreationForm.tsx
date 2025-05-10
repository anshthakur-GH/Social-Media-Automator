import React, { useState } from 'react';
import { Calendar, Upload, Clock, Image as ImageIcon } from 'lucide-react';
import TextArea from '../ui/TextArea';
import Button from '../ui/Button';
import Checkbox from '../ui/Checkbox';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/Card';
import { SocialPlatform } from '../../types';

interface PostCreationFormProps {
  onPublish: (content: string, platforms: SocialPlatform[], scheduledDate?: Date, image?: File) => void;
}

const PostCreationForm: React.FC<PostCreationFormProps> = ({ onPublish }) => {
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
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <TextArea
            label="What would you like to share?"
            placeholder="Write your post content here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            fullWidth
          />

          {/* Image upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Add Media
            </label>
            <div className="flex items-center space-x-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => document.getElementById('file-upload')?.click()}
                leftIcon={<ImageIcon className="h-4 w-4" />}
              >
                {imageFile ? 'Change Image' : 'Upload Image'}
              </Button>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
              {imageFile && (
                <span className="text-sm text-gray-500">
                  {imageFile.name}
                </span>
              )}
            </div>
            {imagePreview && (
              <div className="mt-2">
                <div className="relative rounded-md overflow-hidden w-full h-48 bg-gray-100">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1 text-white hover:bg-opacity-70"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                    }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Platform selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Select platforms to post to
            </label>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div>
                <Checkbox
                  id="platform-facebook"
                  label="Facebook"
                  checked={selectedPlatforms.includes('facebook')}
                  onChange={() => handlePlatformToggle('facebook')}
                />
              </div>
              <div>
                <Checkbox
                  id="platform-twitter"
                  label="X (Twitter)"
                  checked={selectedPlatforms.includes('twitter')}
                  onChange={() => handlePlatformToggle('twitter')}
                />
              </div>
              <div>
                <Checkbox
                  id="platform-instagram"
                  label="Instagram"
                  checked={selectedPlatforms.includes('instagram')}
                  onChange={() => handlePlatformToggle('instagram')}
                />
              </div>
              <div>
                <Checkbox
                  id="platform-linkedin"
                  label="LinkedIn"
                  checked={selectedPlatforms.includes('linkedin')}
                  onChange={() => handlePlatformToggle('linkedin')}
                />
              </div>
            </div>
          </div>

          {/* Scheduling options */}
          <div className="pt-2">
            <Checkbox
              id="schedule-post"
              label="Schedule for later"
              checked={isScheduling}
              onChange={() => setIsScheduling(!isScheduling)}
            />
            
            {isScheduling && (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <div className="relative w-full">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      value={scheduledDate}
                      onChange={e => setScheduledDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="relative w-full">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Clock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="time"
                      className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      value={scheduledTime}
                      onChange={e => setScheduledTime(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end space-x-2 bg-gray-50 border-t border-gray-100">
          {isScheduling ? (
            <Button 
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              leftIcon={<Calendar className="h-4 w-4" />}
            >
              Schedule Post
            </Button>
          ) : (
            <Button 
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              leftIcon={<Upload className="h-4 w-4" />}
            >
              Publish Now
            </Button>
          )}
        </CardFooter>
      </form>
    </Card>
  );
};

export default PostCreationForm;