import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
// import { ArrowLeft } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

const ARDetection = () => {
  const [isStreaming, setIsStreaming] = useState(false);
  // const navigate = useNavigate();

  const startStream = async () => {
    try {
      const response = await fetch('http://localhost:8000/start');
      if (response.ok) {
        setIsStreaming(true);
      }
    } catch (error) {
      console.error('Failed to start stream:', error);
    }
  };

  const stopStream = async () => {
    try {
      await fetch('http://localhost:8000/stop');
      setIsStreaming(false);
    } catch (error) {
      console.error('Failed to stop stream:', error);
    }
  };

  useEffect(() => {
    return () => {
      if (isStreaming) {
        stopStream();
      }
    };
  }, [isStreaming]);

  return (
    // <div className="min-h-screen bg-gradient-to-b from-teal-500 to-aqua-300 flex flex-col">
    <div className="relative isolate px-6 pt-14 lg:px-8">
      <div 
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" 
          aria-hidden="true"
        >
          <div 
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" 
            style={{
              clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
            }}
          />
          <div 
  className="relative left-[calc(50%+11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[-30deg] bg-gradient-to-bl from-[#9089fc] to-[#ff80b5] opacity-30 sm:left-[calc(50%+30rem)] sm:w-[72.1875rem]" 
  style={{
    clipPath: "polygon(74.1% 44.1%, 76.1% 97.7%, 27.6% 76.8%, 17.9% 100%, 0.1% 64.9%, 27.5% 76.7%, 45.2% 34.5%, 47.5% 58.3%, 52.4% 68.1%, 60.2% 62.4%, 72.5% 32.5%, 80.7% 2%, 85.5% 0.1%, 97.5% 26.9%, 100% 61.6%, 74.1% 44.1%)"
  }}
/>
        </div>
      {/* Back button in top-left corner */}
      {/* <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button> */}

      {/* Main content - centered vertically and horizontally */}
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-3xl">
          <div className="p-6">
            {/* <h1 className="text-2xl font-bold text-center mb-6">AR Object Detection</h1> */}
            
            <div className="aspect-video relative bg-black rounded-lg overflow-hidden">
              {isStreaming && (
                <img
                  src="http://localhost:8000/video_feed"
                  alt="Object Detection Stream"
                  className="w-full h-full object-contain"
                />
              )}
              
              {!isStreaming && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-white">Click Start to begin detection</p>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-center">
              <Button
                onClick={isStreaming ? stopStream : startStream}
                className="w-32"
              >
                {isStreaming ? 'Stop' : 'Start'}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ARDetection;