const employeesTemplate = [
    {
        firstName: 'Pierre',
        lastName: 'LEFEVRE',
        email: 'plefevre1@etu.uqac.ca',
        jobId: 1,
        seniority: Date.parse('2022-01-01'),
        level: 1
    },
    {
        firstName: 'Pierre-Jean',
        lastName: 'MARTIN',
        email: 'pjmartin@etu.uqac.ca',
        jobId: 1,
        seniority: Date.parse('2020-06-15'),
        level: 4
    },
    {
        firstName: 'Martin',
        lastName: 'CABOTTE',
        email: 'martinc@gmail.com',
        jobId: 2,
        seniority: Date.parse('2018-03-04'),
        level: 9
    },
    
];

const salariesTemplate = [
    {
        jobId: 1,
        level: 1,
        increasedIndex: 390,
        durationMonths: 18,
    },
    {
        jobId: 1,
        level: 2,
        increasedIndex: 419,
        durationMonths: 24,
    },
    {
        jobId: 1,
        level: 3,
        increasedIndex: 445,
        durationMonths: 24,
    },
    {
        jobId: 1,
        level: 4,
        increasedIndex: 478,
        durationMonths: 30,
    },
    {
        jobId: 1,
        level: 5,
        increasedIndex: 513,
        durationMonths: 36,
    },
    {
        jobId: 1,
        level: 6,
        increasedIndex: 540,
        durationMonths: 48,
    },
    {
        jobId: 1,
        level: 7,
        increasedIndex: 578,
        durationMonths: 48,
    },
    {
        jobId: 1,
        level: 8,
        increasedIndex: 610,
        durationMonths: 48,
    },
    {
        jobId: 1,
        level: 9,
        increasedIndex: 637,
        durationMonths: 48,
    },
    {
        jobId: 1,
        level: 10,
        increasedIndex: 673,
    }
];

const jobsTemplate = [
    {
        id: 1,
        label: "Ingénieur hospitalier"
    },
    {
        id: 2,
        label: "Ingénieur hospitalier en chef"
    }
];
   
module.exports = { 
    salariesTemplate, employeesTemplate, jobsTemplate
};