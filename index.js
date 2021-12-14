const PORT = process.env.PORT || 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const { contains } = require('cheerio/lib/static')
const { attr } = require('cheerio/lib/api/attributes')
const { response } = require('express')

const app = express()

const sourcenewspapers = [{
        name: 'nbc',
        address: 'https://www.nbcnews.com/climate-in-crisis',
        base: ''
    }, {
        name: 'thetimes',
        address: 'https://www.thetimes.co.uk/environment/climate-change',
        base: ''
    },
    {
        name: 'guardian',
        address: 'https://www.theguardian.com/environment/climate-crisis',
        base: ''
    },
    {
        name: 'telegraph',
        address: 'https://www.telegraph.co.uk/climate-change/',
        base: 'https://www.telegraph.co.uk'
    },
    {
        name: 'bbc',
        address: 'https://www.bbc.com/news/science-environment-56837908',
        base: 'https://www.bbc.com'
    },
    {
        name: 'tnyt',
        address: 'https://www.nytimes.com/international/section/climate',
        base: 'https://www.nytimes.com'
    },
    {
        name: 'sky',
        address: 'https://news.sky.com/climate',
        base: 'https://news.sky.com/'
    }
]

const articles = []

sourcenewspapers.forEach(sourcenewspapers => {
    axios.get(sourcenewspapers.address)
        .then((response) => {
            const html = response.data
            const $ = cheerio.load(html)

            $('a:contains("climate")', html).each(function() {
                const title = $(this).text()
                const url = $(this).attr('href')
                articles.push({
                    title,
                    url: sourcenewspapers.base + url,
                    source: sourcenewspapers.name
                })
            })
        })
})

app.get('/', (req, res) => {
    res.json('Welcome to my The Climate Change News API; Read the readme.md for help or type /news for news')
})

app.get('/news', (req, res) => {
    res.json(articles)
})

app.get('/news/:newspaperId', (req, res) => {
    const newpaperID = req.params.newspaperId
    const newspaperAddress = sourcenewspapers.filter(sourcenewspapers => sourcenewspapers.name == newpaperID)[0].address
    const newspaperBase = sourcenewspapers.filter(sourcenewspapers => sourcenewspapers.name == newpaperID)[0].base

    axios.get(newspaperAddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificarticlesArray = []

            $('a:contains("climate")', html).each(function() {
                const title = $(this).text()
                const url = $(this).attr('href')
                specificarticlesArray.push({
                    title,
                    url: newspaperBase + url,
                    source: newpaperID
                })
            })
            res.json(specificarticlesArray)
        }).catch((err) => console.log(err))
})
app.listen(PORT, () => console.log('server runing on PORT ' + PORT))