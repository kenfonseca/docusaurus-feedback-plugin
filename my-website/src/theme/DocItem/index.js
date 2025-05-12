// Import necessary React hooks and the default DocItem component from Docusaurus
import React, { useEffect, useState } from 'react';
import DocItem from '@theme-original/DocItem'; // Docusaurus' original documentation item renderer

// FeedbackWidget is a floating UI component that shows feedback options for selected text
function FeedbackWidget({ selectedText, position }) {
  const [visible, setVisible] = useState(false); // Internal state to control widget visibility
  let feedback = "";

  // When selectedText changes, decide whether to show the widget
  useEffect(() => {
    if (selectedText) {
      setVisible(true);  // Show widget if there's selected text
    } else {
      setVisible(false); // Hide widget otherwise
    }
  }, [selectedText]);

  // Handle the user clicking the 'Yes' button
  const handleEnter = () => {
    // This is where you'd send feedback to an API or backend
    console.log('Feedback submitted for:', selectedText);
    const feedback = document.getElementById("feedback").value;
    console.log('Feedback: ', feedback);
    setVisible(false); // Hide widget after clicking
  };

  // Handle the user clicking the 'No' button
  const handleCancel = () => {
    console.log('Canceled feedback');
    setVisible(false); // Hide widget after clicking
  }

  // If widget is not visible, return nothing (don't render)
  if (!visible){
    return null;
  } 

  // Define CSS style for floating positioning of the widget near the text
  const style = {
    position: 'absolute',
    top: position.y, // Position vertically based on mouse/text
    left: position.x, // Position horizontally based on mouse/text
    backgroundColor: '#fff', // White background
    border: '1px solid #ccc', // Light gray border
    padding: '10px', // Padding inside the box
    zIndex: 1000, // Make sure it appears above other elements
    color: 'black',
  };

  // Render the widget with selected text and a submit button
  return (
    <div style={style}>
      <p>Provide feedback for:</p>
      <p>"{selectedText}"</p>
      <input type="text" id="feedback" ></input>
      <button onClick={handleEnter}>Enter</button>
      <button onClick={handleCancel}>Cancel</button>
    </div>
  );
}

// DocItemWrapper wraps each documentation page with feedback logic
export default function DocItemWrapper(props) {
  const [selectedText, setSelectedText] = useState(''); // Track currently selected text
  const [position, setPosition] = useState({ x: 0, y: 0 }); // Track position to display the widget

  // Effect to add a listener for text selection
  useEffect(() => {
    // Runs when user releases mouse after selecting text
    const handleMouseUp = (e) => {
      const selection = window.getSelection(); // Get selected text
      const text = selection.toString().trim(); // Convert to string and trim whitespace

      if (text) {
        const rect = selection.getRangeAt(0).getBoundingClientRect(); // Get position of selected text
        // Save selected text and position to state
        setSelectedText(text);
        setPosition({ x: rect.left + window.scrollX, y: rect.top + window.scrollY }); // Account for scroll
      } else {
        // setSelectedText(''); // Clear if no text selected
      }
    };

    // Add the mouseup event listener when component mounts
    document.addEventListener('mouseup', handleMouseUp);

    // Clean up: remove event listener when component unmounts
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []); // Empty dependency array means this only runs on mount/unmount

  // Render the original DocItem plus the FeedbackWidget component
  return (
    <>
      <DocItem {...props} /> {/* Render the default doc content */}
      <FeedbackWidget selectedText={selectedText} position={position} /> {/* Conditionally show widget */}
    </>
  );
}
