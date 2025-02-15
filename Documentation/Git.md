# merge branch develop to main

git status
git branch => tells wether to use main or master
git checkout main
git merge develop
git push

# delete branch

git branch -d develop
git push origin --delete develop

# tag branch

git tag
git tag -a v1.4 -m "any comment"
git push origin tag v1.4

# create a branch

git checkout -b develop
git push origin develop
git status
