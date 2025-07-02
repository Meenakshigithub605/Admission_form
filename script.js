function handlePrepChange(select) {
  const coachingField = document.getElementById('coachingField');
  const coachingInput = document.getElementById('coaching');

  if (select.value === 'coaching') {
    coachingField.style.display = 'block';
    coachingInput.required = true;
  } else {
    coachingField.style.display = 'none';
    coachingInput.required = false;
    coachingInput.value = '';
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('form');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const whatsapp = document.getElementById('whatsapp').value.trim();
    const address = document.getElementById('address').value.trim();
    const nimcet = document.getElementById('nimcet').value.trim();
    const rank = document.getElementById('rank').value.trim();
    const prep = document.getElementById('prep').value;
    const coaching = document.getElementById('coaching').value.trim();

    if (!name || !whatsapp || !address || !nimcet || !rank || !prep || (prep === 'coaching' && !coaching)) {
      alert('All fields are compulsory.');
      return;
    }

    if (!/^\d{10}$/.test(whatsapp)) {
      alert('Whatsapp No. should be exactly 10 digits.');
      return;
    }

    const nimcetNum = Number(nimcet);
    const rankNum = Number(rank);
    if (isNaN(nimcetNum) || nimcetNum < 0 || nimcetNum > 1000) {
      alert('NIMCET Score should be between 0 and 1000.');
      return;
    }
    if (isNaN(rankNum) || rankNum <= 0) {
      alert('Rank should be a positive number.');
      return;
    }

    const coachingOrSelf = prep === 'self' ? 'Self' : coaching;

    fetch('https://sheetdb.io/api/v1/nira5wxeg3jbp', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: [{
          name: name,
          whatsapp: whatsapp,
          address: address,
          nimcet: nimcet,         // ✅ Make sure this matches your SheetDB field name
          rank: rank,
          coaching_self: coachingOrSelf
        }]
      })
    })
    .then((response) => response.json())
    .then((data) => {
      alert('Form submitted successfully!');
      form.reset();
      handlePrepChange(document.getElementById('prep'));
    })
    .catch((error) => {
      console.error(error);
      alert('There was an error submitting the form.');
    });
  });
});
