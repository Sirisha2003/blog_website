const express = require('express')
const Article = require('./../models/article')
const Router = express.Router()

Router.get('/new', (req, res) => {
    res.render('articles/new', { article: new Article() })
})

Router.get('/edit/:id', async(req, res) => {
    const article = await Article.findById(req.params.id)
    res.render('articles/edit', { article: article })
})

Router.get('/:slug', async (req, res) => {
    const article = await Article.findOne({slug: req.params.slug})
    if (article == null) res.redirect('/')
    res.render('articles/show', { article: article })

})

Router.post('/', async (req, res,next) => {
    req.article=new Article()
    next()
},saveArticle('new'))

Router.put('/:id', async (req, res,next) => {
    req.article=await Article.findById(req.params.id)
    next()
},saveArticle('edit'))



Router.delete('/:id',async(req,res)=>{
    await Article.findByIdAndDelete(req.params.id)
    res.redirect('/')
})

function saveArticle(path){
    return async(req,res)=>{
    let article = req.article
        article.title= req.body.title
        article.description= req.body.description
        article.markdown= req.body.markdown
    
    try {
        article = await article.save()
        res.redirect(`/articles/${article.slug}`)
    } catch (e) {
        res.render(`articles/${path}`, { article: article })
    }
}}





module.exports = router