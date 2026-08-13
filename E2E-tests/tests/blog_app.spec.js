const { test, expect, describe, beforeEach } = require('@playwright/test')

describe('Blog App', ()=>{
    beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
      
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Mohammed',
        userName: 'mohammed',
        password: 'salaine'
      }
    })
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        userName: 'mluukkai',
        password: 'salainen'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('ensure the login is shown by default', async ({page})=>{

    await expect(page.getByText('Login to application')).toBeVisible()
    await expect(page.getByPlaceholder('Enter your username')).toBeVisible()
    await expect(page.getByPlaceholder('Enter your password')).toBeVisible()
  })


  describe('Login', ()=>{
    test('login with right credentials', async ({page}) => {

      await page.getByText('login').first().click()

      await page.getByRole('textbox').first().fill('mluukkai')

      await page.getByRole('textbox').last().fill('salainen')

      await page.getByRole('button',{name:'login'}).click()

      await expect(page.getByText('blogs')).toBeVisible()
    })

    test('login with wrong credentials', async ({page})=>{

      await page.getByText('login').first().click()

      await page.getByRole('textbox').first().fill('mluukkai')

      await page.getByRole('textbox').last().fill('salainen1')

      await page.getByRole('button',{name:'login'}).click()

      await expect(page.getByText('wrong credentials')).toBeVisible() 
    })
  })

  describe('new blog can be created',  () => {
    test('login with right credentials and create new blog', async ({page}) => {

      await page.getByText('login').first().click()

      await page.getByRole('textbox').first().fill('mluukkai')
      await page.getByRole('textbox').last().fill('salainen')
      await page.getByRole('button',{name:'login'}).click()
      // await expect(page.getByText('Matti Luukkainen is logged in')).toBeVisible()

      await page.getByText('create blog').click()
    
      await page.getByPlaceholder('write title here').fill('test from playwright')
      await page.getByPlaceholder('write author here').fill('mohammed')
      await page.getByPlaceholder('write url here').fill('testURL')

      await page.getByRole('button', {name: 'create'}).click()

      await expect(page.getByText('test from playwright')).toBeVisible()


    })

    test('login with right credentials and create new blog and like it', async ({page}) => {

      await page.getByText('login').first().click()

      await page.getByRole('textbox').first().fill('mluukkai')
      await page.getByRole('textbox').last().fill('salainen')
      await page.getByRole('button',{name:'login'}).click()

      await page.getByText('create blog').click()

      await page.getByPlaceholder('write title here').fill('test from playwright')
      await page.getByPlaceholder('write author here').fill('mohammed')
      await page.getByPlaceholder('write url here').fill('testURL')

      await page.getByRole('button', {name: 'create'}).click()

      await page.getByText('test from playwright').click()


      await page.getByRole('button',{name: 'view'}).click()
      await page.getByRole('button',{name: 'like'}).click()

      await expect(page.getByText('likes 1')).toBeVisible()

    })

    test('login with right credentials and create new blog and like it and delete it', async ({page}) => {

      await page.getByText('login').first().click()

      await page.getByRole('textbox').first().fill('mluukkai')
      await page.getByRole('textbox').last().fill('salainen')
      await page.getByRole('button',{name:'login'}).click()

      await page.getByText('create blog').click()


      await page.getByPlaceholder('write title here').fill('test from playwright')
      await page.getByPlaceholder('write author here').fill('mohammed')
      await page.getByPlaceholder('write url here').fill('testURL')

      await page.getByRole('button', {name: 'create'}).click()

      await page.getByText('test from playwright').click()


      await page.getByRole('button',{name: 'view'}).click()

      page.on('dialog', async dialog => {

        expect(dialog.message()).toBe('Remove blog \'test from playwright\' by \'mohammed\'?');

        expect(dialog.type()).toBe('confirm');
        await dialog.accept();
      });

      await page.getByRole('button',{name: 'remove'}).click()

      await expect(page.getByText('test from playwright').last()).not.toBeVisible()
    })
  })

  // describe('ensure blog remove button is not visible to other users',   () => {
  //   test('ensure blog remove button is not visible to other users', async ({page})=>{

  //     await page.getByRole('textbox').first().fill('mluukkai')
  //     await page.getByRole('textbox').last().fill('salainen')
  //     await page.getByRole('button',{name:'login'}).click()

  //     await page.getByRole('button', {name: 'new blog'}).click()

  //     await page.getByPlaceholder('write title here').fill('test from playwright 2')
  //     await page.getByPlaceholder('write author here').fill('mohammed 2')
  //     await page.getByPlaceholder('write url here').fill('testURL 2')

  //     await page.getByRole('button', {name: 'create'}).click()
  //     await page.getByRole('button', {name: 'logout'}).click()

  //     await page.getByRole('textbox').first().fill('mohammed')
  //     await page.getByRole('textbox').last().fill('salaine')
  //     await page.getByRole('button',{name:'login'}).click()

  //     await page.getByRole('button',{name:'view'}).click()

  //     await expect(page.getByRole('button',{name:'remove'})).not.toBeVisible()
  //   })
  // })
})





//! 2nd test
describe('ensure blogs are ordered according to likes', () => {

  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')

    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        userName: 'mluukkai',
        password: 'salainen'
      }
    })

    const loginResponse = await request.post('http://localhost:3003/api/login', {
      data: {
        userName: 'mluukkai',
        password: 'salainen'
      }
    })
    const user = await loginResponse.json()
    const token = user.token

    await request.post('http://localhost:3003/api/blogs', {
      data: {
        title: 'test from playwright 3',
        author: 'mohammed',
        likes: 15,
        url: 'testURL 3'
      },
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    await request.post('http://localhost:3003/api/blogs', {
      data: {
        title: 'test from playwright 4',
        author: 'mohammed',
        likes: 5,
        url: 'testURL 4'
      },
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    await request.post('http://localhost:3003/api/blogs', {
      data: {
        title: 'test from playwright 5',
        author: 'mohammed',
        likes: 0,
        url: 'testURL 5'
      },
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('ensure blogs are ordered according to likes', async ({ page }) => {
    await page.getByRole('textbox').first().fill('mluukkai')
    await page.getByRole('textbox').last().fill('salainen')
    await page.getByRole('button', { name: 'login' }).click()

    await expect(page.getByRole('button', { name: 'view' })).toHaveCount(3)

    // الحل الجذري: الضغط على الزر الأول المتوفر طالما فيه أزرار باسم view
    while (await page.getByRole('button', { name: 'view' }).count() > 0) {
      await page.getByRole('button', { name: 'view' }).first().click()
    }

    await expect(page.locator('.likes')).toHaveCount(3)

    const likesTexts = await page.locator('.likes').allTextContents()
    const likesNumbers = likesTexts.map(text => parseInt(text.replace('likes ', '')))

    expect(likesNumbers[0]).toBeGreaterThanOrEqual(likesNumbers[1])
    expect(likesNumbers[1]).toBeGreaterThanOrEqual(likesNumbers[2])
  })
})