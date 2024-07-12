const Linkedin = {
  config: {
    scrollDelay: 3000,
    actionDelay: 5000,
    maxRequests: -1, // -1 for no limit
    addNote: false, // Set to false to use "Send without a note"
    note: "Hey {{name}}, I'm looking forward to connecting with you!",
    maxPages: -1 // -1 for no limit
  },

  currentPage: 1,
  totalRequestsSent: 0,

  init: function() {
    console.info("Script initialized. Starting with page 1...");
    this.processCurrentPage();
  },

  processCurrentPage: function() {
    console.info(`Processing page ${this.currentPage}...`);
    this.scrollPage();
  },

  scrollPage: function() {
    window.scrollTo({top: document.body.scrollHeight, behavior: "smooth"});
    setTimeout(() => this.findConnectButtons(), this.config.scrollDelay);
  },

  findConnectButtons: function() {
    const buttons = document.querySelectorAll('button span.artdeco-button__text');
    const connectButtons = Array.from(buttons).filter(btn => btn.textContent.trim() === "Connect");
    
    console.debug(`Found ${connectButtons.length} Connect buttons on page ${this.currentPage}`);
    this.sendRequests(connectButtons);
  },

  sendRequests: function(buttons) {
    let requestsSent = 0;
    buttons.forEach((btn, index) => {
      if (this.config.maxRequests !== -1 && this.totalRequestsSent >= this.config.maxRequests) return;
      
      setTimeout(() => {
        btn.click();
        if (this.config.addNote) {
          this.addNote();
        } else {
          this.sendWithoutNote();
        }
        requestsSent++;
        this.totalRequestsSent++;
        console.log(`Sent connection request ${this.totalRequestsSent} (Page ${this.currentPage})`);

        if (index === buttons.length - 1) {
          setTimeout(() => this.goToNextPage(), this.config.actionDelay);
        }
      }, index * this.config.actionDelay);
    });

    if (buttons.length === 0) {
      this.goToNextPage();
    }
  },

  addNote: function() {
    setTimeout(() => {
      const addNoteBtn = document.querySelector('button[aria-label="Add a note"]');
      if (addNoteBtn) {
        addNoteBtn.click();
        setTimeout(() => {
          const textarea = document.querySelector('textarea[name="message"]');
          if (textarea) {
            const name = document.querySelector('.artdeco-entity-lockup__title').textContent.trim();
            textarea.value = this.config.note.replace('{{name}}', name);
            const sendBtn = document.querySelector('button[aria-label="Send now"]');
            if (sendBtn) sendBtn.click();
          }
        }, 1000);
      }
    }, 1000);
  },

  sendWithoutNote: function() {
    setTimeout(() => {
      const sendWithoutNoteBtn = document.querySelector('button[aria-label="Send without a note"]');
      if (sendWithoutNoteBtn) {
        sendWithoutNoteBtn.click();
      }
    }, 1000);
  },

  goToNextPage: function() {
    if (this.config.maxPages !== -1 && this.currentPage >= this.config.maxPages) {
      console.info("Reached maximum number of pages. Script finished.");
      return;
    }

    const nextButton = document.querySelector('button[aria-label="Next"]');
    if (nextButton && !nextButton.disabled) {
      this.currentPage++;
      console.info(`Moving to page ${this.currentPage}...`);
      nextButton.click();
      setTimeout(() => this.processCurrentPage(), this.config.actionDelay);
    } else {
      console.info("No more pages available. Script finished.");
    }
  }
};

Linkedin.init();
