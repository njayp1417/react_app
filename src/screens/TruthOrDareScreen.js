import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../firebase.config';
import './TruthOrDareScreen.css';

// MASSIVE 1000 TRUTH DATABASE
const TRUTH_DATABASE = [
  "What was your first impression of me?", "What made you fall in love with me?", "What's your favorite memory of us?", "What did you think when we first kissed?", "What's something you were afraid to tell me?", "What's your biggest fear about our relationship?", "What's one thing you wish we did more often?", "What keeps you motivated during hard times?", "What's something I do that makes you feel loved?", "Where do you see us in 5 years?", "What's your dream for our future together?", "What kind of home do you want us to have?", "What tradition do you want to start?", "How have I changed you for the better?", "What's your love language?", "What's something romantic you've always wanted?", "What makes you feel most connected to me?", "What's your favorite way I show affection?", "What always makes you smile about us?", "What's the sweetest thing I've ever done?",
  "What's your biggest turn-on about me?", "What's your favorite part of my body?", "What's something you find irresistibly sexy about me?", "What's your wildest fantasy involving us?", "What's something you've always wanted to try with me?", "What's your favorite way to be touched?", "What's the most arousing thing I do?", "What's your secret desire?", "What drives you crazy in the best way?", "What's your favorite intimate moment we've shared?", "What's something that instantly makes you want me?", "What's your favorite way to tease me?", "What's the sexiest outfit you want to see me in?", "What's your favorite way to be kissed?", "What's something you love about our physical chemistry?", "What's your favorite position?", "What's something you want me to whisper in your ear?", "What's your favorite way to be seduced?", "What's the most passionate moment we've had?", "What's something you find incredibly attractive about me?",
  "What's your deepest insecurity?", "What's something you've never told anyone?", "What's your biggest regret?", "What's something you're ashamed of?", "What's your darkest secret?", "What's something you're afraid I'll find out?", "What's your biggest weakness?", "What's something you hate about yourself?", "What's your most embarrassing moment?", "What's something you wish you could change about yourself?", "What's your biggest fear in life?", "What's something that makes you cry?", "What's your most painful memory?", "What's something you're jealous of?", "What's your biggest disappointment?", "What's something you're proud of but never talk about?", "What's your biggest dream that you're afraid to pursue?", "What's something you judge others for?", "What's your worst habit?", "What's something you pretend to like but don't?",
  "What's something I do that annoys you?", "What's something you wish I understood better?", "What's our biggest relationship challenge?", "What's something you want to improve about us?", "What's something you're grateful for in our relationship?", "What's something you miss from when we first started dating?", "What's something you want us to work on together?", "What's your favorite thing about our communication?", "What's something you wish we talked about more?", "What's something you admire about how we handle conflict?", "What's something you want to experience with me?", "What's your favorite way we spend time together?", "What's something you love about our dynamic?", "What's something you want to celebrate about us?", "What's something you're excited about for our future?", "What's something you want to promise me?", "What's something you want to ask me but haven't?", "What's something you want to confess?", "What's something you want to thank me for?", "What's something you want to apologize for?",
  "What's your ultimate romantic fantasy?", "What's something you've always wanted to do in bed?", "What's your favorite way to be dominated?", "What's your favorite way to take control?", "What's something kinky you want to try?", "What's your favorite roleplay scenario?", "What's something taboo that excites you?", "What's your favorite way to build anticipation?", "What's something you want to do to drive me wild?", "What's your favorite way to be surprised?", "What's something you want to explore together?", "What's your favorite way to be worshipped?", "What's something you want to do that would shock me?", "What's your favorite way to be teased?", "What's something you want to do in public?", "What's your favorite way to be seduced slowly?", "What's something you want to whisper to me?", "What's your favorite way to show your desire?", "What's something you want to do all night?", "What's your favorite way to make me beg?",
  "What's something from your past you've never shared?", "What's your most embarrassing sexual experience?", "What's something you regret not doing?", "What's your wildest experience before me?", "What's something you learned about yourself through past relationships?", "What's something you wish you could redo?", "What's your most adventurous moment?", "What's something you're glad you experienced?", "What's something you wish you had done differently?", "What's your most spontaneous decision?", "What's something you're proud of from your past?", "What's something that shaped who you are?", "What's your most rebellious moment?", "What's something you got away with?", "What's your biggest 'what if'?", "What's something you wish you could tell your younger self?", "What's your most life-changing moment?", "What's something you're grateful happened?", "What's your biggest lesson learned?", "What's something you wish you could forget?",
  "What do you want me to do to you right now?", "What's something you crave from me?", "What's something you want more of?", "What's something you want to feel?", "What's something you want to experience?", "What's something you want to hear me say?", "What's something you want to see me do?", "What's something you want to give me?", "What's something you want to receive?", "What's something you want to explore?", "What's something you want to master?", "What's something you want to surrender to?", "What's something you want to control?", "What's something you want to worship?", "What's something you want to devour?", "What's something you want to savor?", "What's something you want to discover?", "What's something you want to unleash?", "What's something you want to indulge in?", "What's something you want to lose yourself in?",
  "What emotion do I bring out in you most?", "What's something that makes you feel vulnerable with me?", "What's something that makes you feel powerful?", "What's something that makes you feel safe?", "What's something that makes you feel desired?", "What's something that makes you feel cherished?", "What's something that makes you feel complete?", "What's something that makes you feel alive?", "What's something that makes you feel beautiful?", "What's something that makes you feel confident?", "What's something that makes you feel nervous?", "What's something that makes you feel excited?", "What's something that makes you feel peaceful?", "What's something that makes you feel passionate?", "What's something that makes you feel grateful?", "What's something that makes you feel proud?", "What's something that makes you feel shy?", "What's something that makes you feel bold?", "What's something that makes you feel tender?", "What's something that makes you feel wild?",
  "What's a secret you've been keeping from me?", "What's something you think about but never say?", "What's something you do when I'm not around?", "What's something you fantasize about?", "What's something you're curious about?", "What's something you're afraid to admit?", "What's something you want but feel guilty about?", "What's something you judge yourself for wanting?", "What's something you're embarrassed to enjoy?", "What's something you do that you think is weird?", "What's something you're self-conscious about?", "What's something you wish you were brave enough to do?", "What's something you think about during intimate moments?", "What's something you want to confess?", "What's something you're dying to know about me?", "What's something you assume about me?", "What's something you wonder about our relationship?", "What's something you're afraid to ask?", "What's something you want permission for?", "What's something you want to be forgiven for?",
  "What's your favorite way to be touched?", "What's your most sensitive spot?", "What's something that gives you chills?", "What's your favorite sensation?", "What's something that makes you melt?", "What's your favorite way to touch me?", "What's something you love about my touch?", "What's your favorite way to be held?", "What's something that drives you crazy?", "What's your favorite way to be kissed?", "What's something you love about my lips?", "What's your favorite way to be caressed?", "What's something you love about my hands?", "What's your favorite way to be embraced?", "What's something you love about my body?", "What's your favorite way to be explored?", "What's something that makes you shiver?", "What's your favorite way to be pleasured?", "What's something that makes you gasp?", "What's your favorite way to be loved?",
  "What's something you want us to do together?", "What's a place you want to make love?", "What's an experience you want to share?", "What's something you want to try for the first time?", "What's something you want to master together?", "What's a memory you want to create?", "What's an adventure you want to go on?", "What's something you want to celebrate?", "What's a milestone you're excited about?", "What's something you want to achieve together?", "What's a tradition you want to start?", "What's something you want to explore?", "What's a fantasy you want to fulfill?", "What's something you want to experience?", "What's a moment you want to capture?", "What's something you want to discover?", "What's a journey you want to take?", "What's something you want to build?", "What's a legacy you want to create?", "What's something you want to promise?",
  "What's the dirtiest thing you've ever thought about doing to me?", "Describe in explicit detail what you want me to do with my mouth", "What's the most taboo fantasy you have about us?", "Tell me exactly how you want me to dominate you", "What's the filthiest thing you want to whisper in my ear during sex?", "Describe your perfect orgasm in graphic detail", "What's the kinkiest roleplay scenario that turns you on?", "Tell me about your wettest dream involving me", "What's the most degrading thing you secretly want me to do?", "Describe exactly how you touch yourself when thinking of me", "What's your most perverted sexual desire?", "Tell me the nastiest thing you want to do in public", "What's your ultimate submissive fantasy?", "Describe the most intense climax you want us to have", "What's the raunchiest thing you've masturbated to?", "Tell me your deepest, darkest sexual confession", "What's the most explicit thing you want to record us doing?", "Describe your perfect threesome scenario", "What's the most shameful thing that turns you on?", "Tell me exactly how you want me to make you scream"
];

const DARE_DATABASE = [
  "Send me a voice note singing our song", "Take a selfie with something that reminds you of me", "Write 'I love you' in 5 different languages", "Do a little dance and send me a video", "Draw a picture of us together", "Create a 30-second love poem about us", "Make up a silly song about our relationship", "Take a photo recreating our first picture together", "Write a short story about our future", "Design our dream house layout", "Send me a photo of the sunset with a love message", "Record yourself saying 10 things you love about me", "Write a love letter and read it out loud", "Plan our next virtual date in detail", "Create a playlist of 10 songs that describe our love", "Show me your current view and describe what you're thinking", "Take a photo of something that makes you think of me", "Send me a video tour of your day", "Show me what you're wearing and why you chose it", "Take a picture of your hand and imagine I'm holding it",
  "Do 20 jumping jacks while saying my name", "Eat something without using your hands", "Try to lick your elbow for 30 seconds", "Do your best impression of me", "Speak in an accent for the next 3 messages", "Do the chicken dance for 30 seconds", "Try to touch your nose with your tongue", "Make the funniest face you can and send a photo", "Pretend to be a news reporter and give me the weather", "Do your best superhero pose and explain your powers", "Sing happy birthday like you're a opera singer", "Do 10 push-ups while complimenting me", "Pretend you're a cat for the next 5 minutes", "Do a cartwheel or attempt one", "Speak only in questions for 10 minutes", "Do your best robot dance", "Pretend you're giving a cooking show demonstration", "Do your best celebrity impression", "Sing the alphabet backwards", "Do a handstand against the wall",
  "Send me a photo of you biting your lip", "Take a selfie in your most seductive pose", "Send me a voice note whispering something sweet", "Take a photo of you in your favorite underwear", "Send me a video of you doing a slow, sensual dance", "Take a mirror selfie showing off your best angle", "Send me a photo of you looking over your shoulder", "Record yourself saying something that would make me blush", "Take a photo of you in bed looking sleepy and cute", "Send me a video of you blowing me a kiss", "Take a selfie with your hair messy and sexy", "Send me a photo of you stretching", "Record yourself humming seductively", "Take a photo of you with your shirt slightly off your shoulder", "Send me a video of you winking", "Take a selfie of you licking your lips", "Send me a photo of you in the shower (appropriate parts only)", "Record yourself saying my name in the sexiest way possible", "Take a photo of you touching your neck", "Send me a video of you running your fingers through your hair",
  "Describe in detail what you want to do to me right now", "Send me a voice note of you moaning my name", "Take a photo of the part of your body you want me to kiss most", "Record yourself breathing heavily and send it", "Describe your favorite fantasy involving us", "Send me a photo of you in your sexiest outfit", "Record yourself whispering dirty things you want to do", "Take a photo that shows your most attractive feature", "Send me a voice note describing how you want to be touched", "Take a selfie that would drive me crazy with desire", "Record yourself making the sounds you make when you're turned on", "Send me a photo of you in a position you want to try", "Describe in detail how you want our next intimate moment to go", "Take a photo of your lips and tell me what you want to do with them", "Send me a voice note of you saying exactly what you're thinking about", "Take a photo that shows off your curves", "Record yourself telling me your deepest desire", "Send me a photo of you touching yourself (appropriately)", "Describe what you're wearing underneath your clothes", "Take a video of you slowly removing one piece of clothing",
  "Write an erotic poem about us and read it aloud", "Draw a picture of us in an intimate moment", "Create a sexy playlist and explain each song choice", "Write a short erotic story featuring us", "Design a romantic date and describe every detail", "Create a photo collage of things that remind you of our love", "Write song lyrics about our physical chemistry", "Draw or describe your ideal romantic evening", "Create a list of 20 things you want to do to my body", "Write a letter describing your deepest fantasies", "Design the perfect romantic getaway for us", "Create a bucket list of intimate experiences", "Write a detailed description of your dream wedding night", "Design a romantic room setup for us", "Create a timeline of our relationship's most passionate moments", "Write a haiku about desire", "Design matching tattoos that represent our love", "Create a romantic scavenger hunt", "Write vows that include your physical desires", "Design a couples' game just for us",
  "Go somewhere semi-public and take a risky photo", "Send me a photo from your most daring angle", "Record yourself doing something you've never done before", "Take a photo in your most confident pose", "Send me a video of you being completely yourself", "Take a photo that shows your wild side", "Record yourself saying something you've always wanted to say", "Send me a photo that would make others jealous", "Take a video of you doing something spontaneous", "Send me a photo of you breaking one of your own rules", "Record yourself singing a song that describes your desires", "Take a photo in a place you shouldn't", "Send me a video of you being completely uninhibited", "Take a photo that captures your rebellious side", "Record yourself doing your sexiest walk", "Send me a photo of you in your most daring outfit", "Take a video of you doing something that scares you", "Send me a photo that shows your adventurous spirit", "Record yourself saying yes to something you usually say no to", "Take a photo that captures your untamed side",
  "Do yoga poses while thinking about me", "Exercise while wearing something sexy", "Do stretches that show off your flexibility", "Dance like no one is watching and record it", "Do a workout routine in minimal clothing", "Show me your best athletic move", "Demonstrate your flexibility", "Do a sensual warm-up routine", "Show me how you move when you're feeling confident", "Do exercises that highlight your best features", "Stretch in ways that would distract me", "Show me your most graceful movements", "Do a routine that makes you feel powerful", "Demonstrate your strength in a sexy way", "Show me how you move when you're feeling playful", "Do movements that make you feel beautiful", "Exercise in a way that would catch my attention", "Show me your most fluid movements", "Do a routine that makes you feel alive", "Demonstrate how you move when you're happy",
  "Record yourself humming our favorite song", "Send me a voice note of you laughing", "Record the sound of you breathing deeply", "Send me audio of you saying sweet things", "Record yourself whispering secrets", "Send me a voice note of you being silly", "Record yourself making happy sounds", "Send me audio of you singing in the shower", "Record yourself saying my name in different ways", "Send me a voice note of you being flirty", "Record yourself making the sounds of pleasure", "Send me audio of you being spontaneous", "Record yourself telling a story", "Send me a voice note of you being vulnerable", "Record yourself expressing your desires", "Send me audio of you being confident", "Record yourself saying things that make you blush", "Send me a voice note of you being playful", "Record yourself making sounds that drive me wild", "Send me audio of you being completely honest",
  "Model your sexiest outfit for me", "Show me your favorite lingerie", "Wear something that makes you feel powerful", "Put on an outfit that drives you crazy", "Show me your most comfortable sexy clothes", "Wear something you know I love", "Put on an outfit for a fantasy scenario", "Show me your most daring fashion choice", "Wear something that makes you feel beautiful", "Put on an outfit that represents your mood", "Show me your most confident look", "Wear something that makes you feel wild", "Put on an outfit for our dream date", "Show me your most playful style", "Wear something that makes you feel unstoppable", "Put on an outfit that tells a story", "Show me your most romantic look", "Wear something that makes you feel free", "Put on an outfit that captures your essence", "Show me your most authentic style",
  "Share your deepest fear about us", "Tell me something you've never told anyone", "Admit something you're embarrassed about", "Confess a secret desire", "Share your most vulnerable moment", "Tell me about your biggest insecurity", "Admit something you judge yourself for", "Share a memory that shaped you", "Tell me about a time you felt most alive", "Confess something you're afraid to want", "Share your most passionate belief", "Tell me about your greatest joy", "Admit something you're proud of but don't talk about", "Share your biggest dream", "Tell me about your most transformative experience", "Confess something you want to change", "Share your most grateful moment", "Tell me about your deepest connection", "Admit something you want to overcome", "Share your most authentic self",
  "Do something completely unexpected", "Surprise me with something creative", "Show me a side of yourself I haven't seen", "Do something that would shock me", "Surprise me with a hidden talent", "Show me something you've been hiding", "Do something completely out of character", "Surprise me with a confession", "Show me your most spontaneous side", "Do something that would make me smile", "Surprise me with your boldness", "Show me something that represents you", "Do something that would make me proud", "Surprise me with your creativity", "Show me your most playful side", "Do something that would make me laugh", "Surprise me with your vulnerability", "Show me something that would inspire me", "Do something that would make me fall for you again", "Surprise me with your authentic self",
  "Record yourself masturbating while moaning my name", "Take a completely nude photo in your sexiest pose", "Send me a video of you pleasuring yourself", "Record yourself having an orgasm and send the audio", "Take photos of every inch of your naked body", "Send me a video of you using a sex toy", "Record yourself describing in detail how you want to be fucked", "Take a photo of you completely naked and wet", "Send me a video of you touching yourself in the shower", "Record yourself begging me to fuck you", "Take a photo showing your most intimate parts", "Send me a video of you in your most compromising position", "Record yourself saying the filthiest things you can think of", "Take a nude selfie that shows everything", "Send me a video of you simulating sex", "Record yourself making the sounds you make during climax", "Take a photo of you naked in a public place", "Send me a video of you doing something sexually explicit", "Record yourself confessing your dirtiest fantasies while touching yourself", "Take a photo that would get you in trouble if anyone else saw it"
];

export default function TruthOrDareScreen() {
  const [userChoice, setUserChoice] = useState(null);
  const [gameState, setGameState] = useState({ current_turn: 'nelson', waiting_for_answer: false });
  const [isMyTurn, setIsMyTurn] = useState(false);

  useEffect(() => {
    // Get user choice from localStorage
    const choice = localStorage.getItem('userChoice');
    if (choice) {
      setUserChoice(choice);
    }
  }, []);

  useEffect(() => {
    if (userChoice) {
      loadGameState();
      const unsubscribe = subscribeToGameState();
      return unsubscribe;
    }
  }, [userChoice]);

  const loadGameState = async () => {
    const { data } = await supabase.from('game_state').select('*').single();
    if (data) {
      setGameState(data);
      updateButtonState(data);
    }
  };

  const subscribeToGameState = () => {
    const subscription = supabase
      .channel('game_state')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'game_state' }, (payload) => {
        setGameState(payload.new);
        updateButtonState(payload.new);
      })
      .subscribe();
    return () => subscription.unsubscribe();
  };

  const updateButtonState = (state) => {
    if (!userChoice) return;
    
    // Simple logic: if it's my turn and not waiting, I can play
    const canPlay = (state.current_turn === userChoice) && !state.waiting_for_answer;
    setIsMyTurn(canPlay);
  };



  const getRandomQuestion = () => {
    const receiverId = userChoice === 'nelson' ? 'juliana' : 'nelson';
    const isForHer = receiverId === 'juliana';
    
    // Filter dares based on who will receive them
    const appropriateDares = DARE_DATABASE.filter(dare => {
      const dareText = dare.toLowerCase();
      
      if (isForHer) {
        // Dares for Juliana (feminine/sensual)
        return dareText.includes('selfie') || dareText.includes('photo') || 
               dareText.includes('dance') || dareText.includes('outfit') || 
               dareText.includes('lingerie') || dareText.includes('pose') || 
               dareText.includes('lips') || dareText.includes('hair') || 
               dareText.includes('voice') || dareText.includes('seductive') ||
               dareText.includes('sexy') || dareText.includes('beautiful') ||
               dareText.includes('curves') || dareText.includes('stretch') ||
               dareText.includes('yoga') || dareText.includes('mirror');
      } else {
        // Dares for Nelson (masculine/bold)
        return dareText.includes('workout') || dareText.includes('push-ups') || 
               dareText.includes('strength') || dareText.includes('athletic') || 
               dareText.includes('confident') || dareText.includes('bold') ||
               dareText.includes('superhero') || dareText.includes('impression') ||
               dareText.includes('sing') || dareText.includes('dance') ||
               dareText.includes('creative') || dareText.includes('draw') ||
               dareText.includes('poem') || dareText.includes('story');
      }
    });
    
    // Filter truths based on who will receive them
    const appropriateTruths = TRUTH_DATABASE.filter(truth => {
      const truthText = truth.toLowerCase();
      
      if (isForHer) {
        // Truths for Juliana (feminine perspective)
        return truthText.includes('feel') || truthText.includes('beautiful') || 
               truthText.includes('romantic') || truthText.includes('love') ||
               truthText.includes('emotion') || truthText.includes('heart') ||
               truthText.includes('dream') || truthText.includes('fantasy') ||
               truthText.includes('desire') || truthText.includes('want') ||
               truthText.includes('favorite') || truthText.includes('cherish') ||
               truthText.includes('vulnerable') || truthText.includes('intimate') ||
               truthText.includes('touch') || truthText.includes('kiss') ||
               truthText.includes('body') || truthText.includes('sexy') ||
               truthText.includes('turn-on') || truthText.includes('attraction');
      } else {
        // Truths for Nelson (masculine perspective)
        return truthText.includes('strong') || truthText.includes('confident') || 
               truthText.includes('protect') || truthText.includes('provide') ||
               truthText.includes('lead') || truthText.includes('control') ||
               truthText.includes('dominate') || truthText.includes('power') ||
               truthText.includes('challenge') || truthText.includes('goal') ||
               truthText.includes('achieve') || truthText.includes('build') ||
               truthText.includes('future') || truthText.includes('plan') ||
               truthText.includes('wild') || truthText.includes('adventure') ||
               truthText.includes('bold') || truthText.includes('risk') ||
               truthText.includes('fantasy') || truthText.includes('desire');
      }
    });
    
    // If filtered lists are too small, use all questions
    const finalTruths = appropriateTruths.length > 50 ? appropriateTruths : TRUTH_DATABASE;
    const finalDares = appropriateDares.length > 20 ? appropriateDares : DARE_DATABASE;
    
    const allQuestions = [
      ...finalTruths.map(q => ({ type: 'Truth', question: q })),
      ...finalDares.map(q => ({ type: 'Dare', question: q }))
    ];
    
    const randomIndex = Math.floor(Math.random() * allQuestions.length);
    return allQuestions[randomIndex];
  };

  const playGame = async () => {
    console.log('=== PLAY GAME FUNCTION CALLED ===');
    console.log('Is my turn:', isMyTurn);
    console.log('User:', userChoice);
    console.log('Game state:', gameState);
    
    if (!userChoice) {
      alert('No user found. Please refresh and login again.');
      return;
    }
    
    if (!isMyTurn) {
      console.log('❌ Not my turn');
      alert('Not your turn!');
      return;
    }
    
    try {
      console.log('✅ Starting game...');
      const randomQuestion = getRandomQuestion();
      console.log('Random question:', randomQuestion);
      
      // Send question to partner's chat
      console.log('Sending question to partner...');
      await sendQuestionToPartner(randomQuestion.type, randomQuestion.question);
      console.log('✅ Question sent to partner');
      
      // Update game state - now waiting for partner's answer
      console.log('Updating game state...');
      const { error } = await supabase
        .from('game_state')
        .update({
          waiting_for_answer: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', 1);
        
      if (error) {
        console.error('❌ Error updating game state:', error);
        alert('Error updating game: ' + error.message);
      } else {
        console.log('✅ Game state updated successfully');
        alert('Question sent! Check your partner\'s chat.');
      }
    } catch (error) {
      console.error('❌ Error in playGame:', error);
      alert('Error: ' + error.message);
    }
  };

  const sendQuestionToPartner = async (type, question) => {
    const senderId = userChoice;
    const receiverId = userChoice === 'nelson' ? 'juliana' : 'nelson';
    
    const messageText = `🎮 Truth or Dare Game\n\n${type}: ${question}\n\n💬 Answer this question in chat to continue our game! 😘`;
    
    await supabase
      .from('messages')
      .insert({
        text: messageText,
        sender_id: senderId,
        receiver_id: receiverId,
        message_status: 'sent'
      });
  };

  const answerReceived = async () => {
    console.log('=== ANSWER RECEIVED ===');
    console.log('Current user:', userChoice);
    console.log('Current game state:', gameState);
    
    // The person who answered should get the next turn
    const nextTurn = userChoice; // The person clicking this button answered, so they get next turn
    
    console.log('Setting next turn to:', nextTurn);
    
    const { error } = await supabase
      .from('game_state')
      .update({
        current_turn: nextTurn,
        waiting_for_answer: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', 1);
      
    if (error) {
      console.error('Error updating game state:', error);
    } else {
      console.log('✅ Turn switched successfully to:', nextTurn);
    }
  };





  return (
    <div className="tod-container">
      <div className="tod-galaxy-bg">
        <div className="tod-stars"></div>
        <div className="tod-stars2"></div>
      </div>

      <div className="tod-header">
        <h1 className="tod-title">
          <span className="title-nelson">TRUTH</span>
          <span className="title-heart">💕</span>
          <span className="title-juliana">DARE</span>
        </h1>
        <p className="tod-subtitle">2000 Questions • Romantic & Spicy</p>
      </div>

      <div className="game-status">
        <div className="turn-indicator">
          <div className="current-player">
            <span className={`player-name ${userChoice}`}>
              {userChoice?.toUpperCase() || 'LOADING'}
            </span>
            <span className="turn-label">
              {isMyTurn ? 'YES' : 'NO'}
            </span>
          </div>
        </div>
      </div>

      <div className="game-button-container">
        <button 
          className={`game-button ${isMyTurn ? 'active' : 'disabled'}`}
          onClick={playGame}
          disabled={!isMyTurn}
        >
          <div className="button-icon">🎮</div>
          <div className="button-text">
            {isMyTurn ? 'PLAY A GAME' : 'WAIT FOR TURN'}
          </div>
          <div className="button-subtitle">
            {isMyTurn ? `Send Truth or Dare to ${userChoice === 'nelson' ? 'Juliana' : 'Nelson'}` : 'Not your turn'}
          </div>
        </button>
      </div>
      


      <div className="game-info">
        <div className="info-card">
          <h4>How it works:</h4>
          <ul>
            <li>Tap "PLAY A GAME" to send a random Truth or Dare to {userChoice === 'nelson' ? 'Juliana' : 'Nelson'}</li>
            <li>Questions are sent to {userChoice === 'nelson' ? 'Juliana\'s' : 'Nelson\'s'} chat</li>
            <li>Answer {userChoice === 'nelson' ? 'Juliana\'s' : 'Nelson\'s'} questions in chat to switch turns</li>
            <li>Take turns asking each other spicy questions! 🔥</li>
          </ul>
        </div>
      </div>

      {gameState.waiting_for_answer && (
        <div className="answer-prompt">
          <p>💬 {gameState.current_turn === userChoice ? `Waiting for ${userChoice === 'nelson' ? 'Juliana' : 'Nelson'} to answer...` : `${gameState.current_turn === 'nelson' ? 'Nelson' : 'Juliana'} sent you a Truth or Dare question! Answer it to continue the game.`}</p>
          {gameState.current_turn !== userChoice && (
            <button className="answer-btn" onClick={answerReceived}>
              I Answered in Chat
            </button>
          )}
        </div>
      )}
    </div>
  );
}