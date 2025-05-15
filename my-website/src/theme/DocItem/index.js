// Import React hooks 
import React, { useEffect, useState } from 'react';
// Import default Docusaurus DocItem component
import DocItem from '@theme-original/DocItem'; // Item renderer (Docusaurus)
// import initSqlJs from 'sql.js';]

// FeedbackWidget is a floating UI component that shows feedback options for selected text
function FeedbackWidget({ selectedText, position, feedbackArray, setFeedbackArray }) {
  const [visible, setVisible] = useState(false); // Internal state to control widget visibility

  // When selectedText changes, decide whether to show the widget
  useEffect(() => {
    if (selectedText) {
      setVisible(true);  // Show widget if there's selected text
    } else {
      setVisible(false); // Hide widget otherwise
    }
  }, [selectedText]);

  // Handle the user clicking the 'Enter' button
  const handleEnter = () => {
    // Pull feedback from user input
    const feedback = document.getElementById("feedback").value;
    // Sending of feedback
    console.log('Feedback:',feedback, '\nSubmitted for:', selectedText);
    // Insert feedback into array
    let feedbackID = feedbackArray.length+1;
    setFeedbackArray([...feedbackArray, { 
      key: 'Feedback' + feedbackID, 
      text: selectedText, 
      feedback: feedback, 
    }]);
    // sql.js does not want to fucking work for some bullshit node module reason
    // insertDb(selectedText, feedback);
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

  // Render the widget with selected text, input, and buttons
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
  // Array to hold all feedback for display 
  const [feedbackArray, setFeedbackArray] = useState([]);
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
      <FeedbackWidget 
        selectedText={selectedText} 
        position={position} 
        feedbackArray={feedbackArray}
        setFeedbackArray={setFeedbackArray}
      /> {/* Conditionally show widget */}
      <div className="feedback-sidebar">
        <DisplayFeedback feedbackArray={feedbackArray}/>
      </div>
    </>
  );
}

// Takes all the feedback items in feedbackArray and displays them on the side
function DisplayFeedback({feedbackArray}){
  const style = {
    position: 'fixed',
    top: '100px',     // Adjust as needed
    right: '20px',
    width: '200px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    zIndex: 1000,
  };

  const buttonStyle = {
    width: '100%',
    padding: '8px',
    border: 'none',
    backgroundColor: '#eee',
    borderRadius: '5px',
    cursor: 'pointer',
  };

  return (
    <div style={style}>
      <strong>Feedback List</strong>
      {feedbackArray.map((item, index) => (
        <button key={item.key || index} style={buttonStyle}>
          <strong>{item.key}</strong><br />
          Text: {item.text}<br />
          Feedback: {item.feedback}
        </button>
      ))}
    </div>
  );
}


// insertDb will take the parameter and properly format it to be inerted into a relational database
async function insertDb(text, feedback){
  // // Create SQL.js object
  // const initSqlJs = require('sql.js');
  const initSqlJs = window.initSqlJs;

  // Locate the sql engine
  const SQL = await initSqlJs({
    // Required to load the wasm binary asynchronously
    locateFile: file => `https://sql.js.org/dist/${file}`
  });

  // Create a database
  const db = new SQL.Database();

  // String to query creation and insertion for database table
  sqlStr = "CREATE TABLE feedback (a int, b char, c char); \
  INSERT INTO feedback VALUES (0, 'this should be the text', 'this should be the feedback');";
  
  // Run query
  db.run(sqlStr);

  // Prepare an sql statement
  const stmt =db.prepare("SELECT * FROM feedback WHERE a=:aval");

  // Bind values to the parameters and fetch the results of the query
  const result = stmt.getAsObject({':aval' : 0});
  console.log(result); 
}