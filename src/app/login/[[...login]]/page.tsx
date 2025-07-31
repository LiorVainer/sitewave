'use client';

import * as Clerk from '@clerk/elements/common';
import * as SignIn from '@clerk/elements/sign-in';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/ui/icons';
import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Constants } from '@/constants/app.const';

export default function SignInPage() {
    return (
        <PageWrapper className='grid w-full h-screen grow items-center px-4 sm:justify-center'>
            <SignIn.Root>
                <Clerk.Loading>
                    {(isGlobalLoading) => (
                        <>
                            <SignIn.Step name='start'>
                                <Card className='w-full sm:w-96'>
                                    <CardHeader>
                                        <CardTitle>Sign in to {Constants.appName}</CardTitle>
                                        <CardDescription>Welcome back! Please sign in to continue</CardDescription>
                                    </CardHeader>
                                    <CardContent className='grid gap-y-4'>
                                        <div className='grid grid-cols-2 gap-x-4'>
                                            <Clerk.Connection name='github' asChild>
                                                <Button
                                                    size='sm'
                                                    variant='outline'
                                                    type='button'
                                                    disabled={isGlobalLoading}
                                                >
                                                    <Clerk.Loading scope='provider:github'>
                                                        {(isLoading) =>
                                                            isLoading ? (
                                                                <Icons.spinner className='size-4 animate-spin' />
                                                            ) : (
                                                                <>
                                                                    <FaGithub className='mr-2 size-4' />
                                                                    GitHub
                                                                </>
                                                            )
                                                        }
                                                    </Clerk.Loading>
                                                </Button>
                                            </Clerk.Connection>
                                            <Clerk.Connection name='google' asChild>
                                                <Button
                                                    size='sm'
                                                    variant='outline'
                                                    type='button'
                                                    disabled={isGlobalLoading}
                                                >
                                                    <Clerk.Loading scope='provider:google'>
                                                        {(isLoading) =>
                                                            isLoading ? (
                                                                <Icons.spinner className='size-4 animate-spin' />
                                                            ) : (
                                                                <>
                                                                    <FcGoogle className='mr-2 size-4' />
                                                                    Google
                                                                </>
                                                            )
                                                        }
                                                    </Clerk.Loading>
                                                </Button>
                                            </Clerk.Connection>
                                        </div>
                                        <div className='relative'>
                                            <div className='absolute inset-0 flex items-center'>
                                                <span className='w-full border-t' />
                                            </div>
                                            <div className='relative flex justify-center text-xs uppercase'>
                                                <span className='bg-background px-2 text-muted-foreground'>or</span>
                                            </div>
                                        </div>
                                        <Clerk.Field name='identifier'>
                                            <Label className='mb-2'>Email address</Label>
                                            <Input type='email' />
                                            <Clerk.FieldError />
                                        </Clerk.Field>
                                    </CardContent>
                                    <CardFooter className='flex flex-col items-start gap-y-4'>
                                        <Clerk.Loading>
                                            {(isLoading) => (
                                                <SignIn.Action submit asChild>
                                                    <Button
                                                        variant={'gradient'}
                                                        disabled={isLoading}
                                                        className='w-full'
                                                    >
                                                        {isLoading ? (
                                                            <Icons.spinner className='mr-2 size-4 animate-spin' />
                                                        ) : null}
                                                        Continue
                                                    </Button>
                                                </SignIn.Action>
                                            )}
                                        </Clerk.Loading>
                                        <p className='text-sm text-muted-foreground'>
                                            Don't have an account?{' '}
                                            <Clerk.Link navigate='sign-up' className='underline'>
                                                Sign up
                                            </Clerk.Link>
                                        </p>
                                    </CardFooter>
                                </Card>
                            </SignIn.Step>
                            {/* Additional steps like 'choose-strategy', 'password', and 'verifications' can be added here */}
                        </>
                    )}
                </Clerk.Loading>
            </SignIn.Root>
        </PageWrapper>
    );
}
