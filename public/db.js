let db
const request = indexDB.open('budgettracker', 1)

request.onupgradeneeded = ({ target }) => {
  db = target.result
  db.createObjectStore('pending', { autoIncrement: true })
}

request.onsuccess = ({ target }) => {
  db = target.result

  if(navigator.onLine) {
    checkDatabase()
  }
}

const saveRecord = record => {
  const dbTransaction = db.transaction(['pending'], 'readwrite')
  const store = transaction.objectStore('pending')
  store.add(record)
}

const checkDatabase = () => {
  const dbTransaction = db.transaction(['pending'], 'readwrite')
  const store = transaction.objectStore('pending')
  const getAll = store.getAll()

  getAll.onsuccess = () => {
    if(getAll.result.length > 0) {
      axios.post('/api/transactions/bulk', getAll.result, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
        .then(() => {
          const dbTransaction = db.transaction(['pending'], 'readwrite')
          const store = transaction.objectStore('pending')
          store.clear()
        })
    }
  }
}

window.addEventListener('online', checkDatabase)