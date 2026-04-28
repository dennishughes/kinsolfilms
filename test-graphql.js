const query = `
  query Productions {
    productionItems(first: 100) {
      nodes {
        title
        slug
        productionItemId
        productionFields {
          status
          releaseYear
          comingSoon {
            datetime
            title
          }
          featured
        }
      }
    }
  }
`;

fetch('https://kinsolfilms.empressave.com/graphql', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query })
})
.then(res => res.json())
.then(data => console.log(JSON.stringify(data, null, 2)))
.catch(err => console.error(err));
