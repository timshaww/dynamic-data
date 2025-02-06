let numbers = [10, 12, 13, 14, 13, 58]
let names = ['John', 'Jane', 'Jack', 'Jill', 'James', 'Jenny']
// console.log(names[3])
names.forEach((name,i) => {
    console.log(name, i)
    if (name === 'Jack') {
        console.log('found Jack at position', i)
    }
})
let person = {
    firstName: 'tim',
    lastName: 'shaw',
    occupation: 'developer',
    email: 'tes101@miami.edu',
    getName: () => {
        return this.firstName + ' ' + this.lastName
    }
}
console.log(person.getName())

let data = {
    brand: {
        name: 'Miami Travel Site', 
        link: '/',
        img: '/images/logo.png'
    },
    links: [
        {test: 'Home', href: '/'},
        {test: 'Beaches', href: '/beaches'},
        {test: 'Night Life', href: '/nightlife'},
        {test: 'About', href: '/about'}
    ],
}