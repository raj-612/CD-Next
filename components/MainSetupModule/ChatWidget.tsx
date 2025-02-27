'use client';

import React, { useState } from 'react';
import { MessageSquare, X, MinusIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const toggleChat = () => {
    if (isMinimized) {
      setIsMinimized(false);
    } else if (!isOpen) {
      setIsOpen(true);
    }
  };

  const closeChat = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
    setIsMinimized(false);
  };

  const minimizeChat = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMinimized(true);
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="fixed bottom-5 right-5 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-all z-50"
        >
          <MessageSquare className="h-6 w-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div 
          className={cn(
            "fixed right-5 shadow-xl transition-all duration-300 z-50",
            "bg-white rounded-lg border border-gray-200 flex flex-col",
            isMinimized 
              ? "bottom-5 w-64 h-12" 
              : "bottom-5 w-80 h-96"
          )}
        >
          {/* Chat Header */}
          <div 
            className="flex items-center justify-between px-4 py-3 border-b border-gray-200 cursor-pointer"
            onClick={() => isMinimized && setIsMinimized(false)}
          >
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              <h3 className="font-medium">Chat Support</h3>
            </div>
            <div className="flex space-x-1">
              {!isMinimized && (
                <button 
                  onClick={minimizeChat}
                  className="p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                >
                  <MinusIcon size={16} />
                </button>
              )}
              <button 
                onClick={closeChat}
                className="p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Chat Body - Only shown when not minimized */}
          {!isMinimized && (
            <div className="flex-1 p-4 overflow-y-auto flex flex-col items-center justify-center bg-gray-50">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 text-blue-200 mx-auto mb-3" />
                <h4 className="text-gray-800 font-medium mb-1">Chat Support Coming Soon</h4>
                <p className="text-gray-500 text-sm">We're working on bringing you live chat support.</p>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
} 