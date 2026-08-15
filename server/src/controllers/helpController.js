const helpArticles = [
  {
    id: '1',
    category: 'Donor Registration',
    question: 'How do I pledge to become an organ donor?',
    answer: 'Select "Donor" during role registration, fill in your medical and personal details, select the organ(s) you wish to donate, and review the informed consent agreement.'
  },
  {
    id: '2',
    category: 'Donor Registration',
    question: 'Can I withdraw my donation consent later?',
    answer: 'Yes. Donors can withdraw their donation consent at any time prior to organ allocation from the Donor Portal under Consent Settings.'
  },
  {
    id: '3',
    category: 'Recipient Registration',
    question: 'How do I register as an organ recipient?',
    answer: 'Register as a Recipient by providing your required organ, medical history, blood group, hospital location, and physician documentation.'
  },
  {
    id: '4',
    category: 'Waiting List',
    question: 'How is my position on the waiting list calculated?',
    answer: 'Waiting-list rank is calculated based on medical urgency level (Critical, High, Medium, Low), waiting duration, blood group compatibility, and donor organ availability.'
  },
  {
    id: '5',
    category: 'Organ Matching',
    question: 'What criteria are used to match donors and recipients?',
    answer: 'The system uses a 5-factor scoring model evaluating Organ Type (30%), ABO Blood Group Compatibility (30%), Recipient Urgency (20%), Waiting Duration (10%), and Hospital Proximity (10%).'
  },
  {
    id: '6',
    category: 'Consent',
    question: 'Is digital consent legally binding in this application?',
    answer: 'This demo platform demonstrates electronic consent logging. In real-world medical procedure, formal legal and clinical documentation is mandated by organ procurement authorities.'
  },
  {
    id: '7',
    category: 'Account & Login',
    question: 'How do I reset my password or access my account?',
    answer: 'Contact your transplant coordinator or system administrator at admin@optm.org for account assistance.'
  },
  {
    id: '8',
    category: 'Transplant Information',
    question: 'What happens after an organ match is approved?',
    answer: 'Once an admin approves a match, the organ moves into Allocation. Cold ischemia time and transport logistics are initiated for surgical scheduling.'
  }
];

const getHelpArticles = (req, res) => {
  const { query, category } = req.query;
  let results = helpArticles;

  if (category) {
    results = results.filter(item => item.category.toLowerCase() === category.toLowerCase());
  }

  if (query) {
    const q = query.toLowerCase();
    results = results.filter(item => 
      item.question.toLowerCase().includes(q) || 
      item.answer.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  }

  res.status(200).json({
    success: true,
    data: results
  });
};

module.exports = { getHelpArticles };
