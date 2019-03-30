+++

author = "Mark Struzinski"
title = "Alfred Diffs With Kaleidoscope"
tags = ["code-review", "git", "alfred", "kaleidoscope"]
date = 2018-07-31T18:21:18-04:00
slug = "alfred-diffs-with-kaleidoscope"

+++

I've recently started trying to identify bottlenecks in my workflow and take a little bit of time to see if I can make things a little easier with automation. It's always a tradeoff between the time spent automating something and actually getting work done. In this case, I can say the balance tipped way over to the side of saving me a great amount of time.

<!--more-->

I frequently have to do code reviews. I try to dedicate a specific time of day to work on code reviews so I can focus on them and knock them out prior to other work. In a lot of cases, people are waiting on those pull requests so they can move forward with their work. I use [Kaleidoscope](https://www.kaleidoscopeapp.com) to perform diffs and to resolve merge conflicts. I discovered after a while, I was doing a dance between several applications to get my code review done. 

I would do the following:

1. Copy the branch name from the Pull Request in the Stash web interface
2. Paste that into terminal following a git checkout command
3. Use the `ksdiff` command to open Kaleidoscope and perform a diff between the current branch (which was the proposed changes int he pull request) asnd the `develop` branch.

This set of steps doesn't seem like a lot until you have to do it several times a day. 😁

I try to maintain a good ratio between doing the actual work, and working on tools that enable me to do my work more efficiently. I spent a pretty hefty amount of time on the tool I'm about to discuss, but I think it has already paid dividends in terms of time saved. I created an opinionated Alfred workflow that helps me get to reviewing code quickly. Before walking through it, here are the following assumptions the tool is making:

1. You own [Alfred](https://www.alfredapp.com/)
2. You purchased the [Alfred PowerPack](https://www.alfredapp.com/powerpack/) to enable workflow functionality
3. You own a copy of  [Kaleidoscope](https://www.kaleidoscopeapp.com)
4. You have installed the `ksdiff` command line tool that enables you to open Kaleidoscope directly to a diff

There is really only 1 setup step that will be specific to your environment. You will need to open the workflow and edit the initial List Filter to include a list of repo locations that you want to be able to use for code review. 

{{< figure src="/images/alfred-ksdiff-list-filter.png" caption="" >}}

After that, you should be able to open Alfred and use the keyword `codereview` to trigger your initial list of code review options.

The workflow will then perform the following:

1. List the repository locations you created in the List Filter

   {{< figure src="/images/alfred-ksdiff-repos.png" caption="" >}}

2. Based on the repository selection, will run a Ruby script to list all local branches and let you select a source branch

   1. This will be the "left" side of the diff

      {{< figure src="/images/alfred-ksdiff-branches.png" caption="" >}}

3. After the source branch selection, will present a list of branches again for the destination branch

   1. This will be the "right" side of the diff

4. After all of these selections have been made, will call the `ksdiff` command to open Kaleidoscope to the diff for review

   {{< figure src="/images/alfred-ksdiff-diff.png" caption="" >}}

Here is an overvierw of the workflow:

{{< figure src="/images/alfred-ksdiff-workflow-overview.png" caption="" >}}

I pushed this workflow to a [GitHub Repo](https://github.com/ski081/alfred-codereview) as well. I hope it helps abyone who happens to use the same tools!